import Video from 'models/video';
import routes from 'routes';

export const home = async (req, res) => {
  let videos = [];
  videos = await Video.find().sort({ createdAt: 'desc' });
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
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
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
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', {
      pageTitle: 'Video is not exist',
      errMsg: 'Video is not exist',
    });
  } else {
    return res.render('watch', { pageTitle: 'Watch', video });
  }
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('edit', { pageTitle: 'Edit', video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { title, description, hashtags } = req.body;

  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video is not exist' });
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

  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render('404', {
      pageTitle: 'Video is not exist',
      errMsg: 'Video is not exist',
    });
  }

  await Video.findOneAndDelete({ _id: id });

  res.redirect('/');
};

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    });
  }
  res.render('search', { pageTitle: 'Search', videos });
};
