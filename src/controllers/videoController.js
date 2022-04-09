import { s3DeleteVideo } from 'middlewares';
import Comment from 'models/Comment';
import User from 'models/User';
import Video from 'models/Video';
import routes from 'routes';

export const home = async (req, res) => {
  let videos = [];
  videos = await Video.find()
    .populate({ path: 'creator', select: 'displayName photoUrl' })
    .sort({ createdAt: 'desc' });
  res.render('home', { pageTitle: 'Home', videos });
};

export const video = (req, res) => {
  let videos = [];
  res.render('home', { pageTitle: 'Home', videos });
};
export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumnail },
  } = req;

  const videoUrl = video[0].location;
  const thumnailUrl = thumnail[0].location;

  const creator = req.session.currentUser._id;

  try {
    let uploadVideo = await Video.create({
      videoUrl,
      thumnailUrl,
      title,
      description,
      creator,
      hashtags: Video.formatHashtags(hashtags),
    });

    // 유저에도 데이터 업데이트
    const user = await User.findOne({ _id: creator });
    user.videos.push(uploadVideo._id);
    user.save();
  } catch (error) {
    return res.render('upload', {
      pageTitle: 'Upload',
      errMsg: error._message,
    });
  }

  return res.redirect('/');
};

export const watch = async (req, res) => {
  const id = req.params.id;

  const video = await Video.findById(id)
    .populate('creator')
    .populate({
      path: 'comments',
      populate: { path: 'creator', select: 'photoUrl displayName' },
    });

  if (!video) {
    return res.render('404', {
      pageTitle: 'Video is not exist',
      errMsg: 'Video is not exist',
    });
  } else {
    return res.render('video/watch', { pageTitle: 'Watch', video });
  }
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);

  if (String(video.creator) !== String(req.session.currentUser._id)) {
    return res.status(403).redirect('/');
  }

  res.render('edit', { pageTitle: 'Edit', video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { title, description, hashtags } = req.body;

  const video = await Video.findById(id);

  if (!video) {
    return res.render('404', { pageTitle: 'Video is not exist' });
  }

  if (String(video.creator) !== String(req.session.currentUser._id)) {
    return res.status(403).redirect('/');
  }

  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    }).setOptions({ runValidators: true });
  } catch (error) {
    return res.render('edit', {
      pageTitle: 'Edit',
      errMsg: error._message,
      video,
    });
  }

  return res.redirect(`${routes.watch(id)}`);
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  const userId = req.session.currentUser._id;

  const video = await Video.findOne({ _id: id });

  if (!video) {
    return res.render('404', {
      pageTitle: 'Video is not exist',
      errMsg: 'Video is not exist',
    });
  }

  if (String(video.creator) !== String(userId)) {
    return res.status(403).redirect('/');
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.render('404', {
      pageTitle: 'User is not exist',
      errMsg: 'User is not exist',
    });
  }

  s3DeleteVideo(video.videoUrl);
  s3DeleteVideo(video.thumnailUrl);
  await Video.findOneAndDelete({ _id: id });
  await user.videos.pull(id);
  await user.save();
  await res.redirect('/');
};

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    })
      .populate({ path: 'creator', select: 'displayName photoUrl' })
      .sort({ createdAt: 'desc' });
  }
  res.render('search', { pageTitle: 'Search', videos });
};

export const registerView = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const writeComment = async (req, res) => {
  const { comment, videoId } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  const user = await User.findById(req.session.currentUser._id);
  if (!user) {
    return res.sendStatus(404);
  }

  let uploadComment = await Comment.create({
    comment,
    creator: user._id,
    video: video._id,
  });
  if (!uploadComment) {
    return res.sendStatus(404);
  }

  video.comments.push(uploadComment);
  video.save();

  user.comments.push(uploadComment);
  user.save();

  return res.sendStatus(200);
};

export const deleteComment = async (req, res) => {
  const { commentId, videoId } = req.body;
  const userId = req.session.currentUser._id;

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.creator) !== String(userId)) {
    return res.sendStatus(403);
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.sendStatus(404);
  }

  const video = await Video.findOne({ _id: videoId });
  if (!video) {
    return res.sendStatus(404);
  }

  await Comment.findOneAndDelete({ _id: commentId });
  await user.comments.pull(commentId);
  await user.save();
  await video.comments.pull(videoId);
  await video.save();

  await res.redirect('/');
};
