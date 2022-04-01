import Video from 'models/video';

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
  await Video.create({
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect('/');
};

export const watch = (req, res) => {
  const id = req.params.id;
  res.render('watch', { pageTitle: 'Watch', id });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('edit', { pageTitle: 'Edit', video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { title, description, hashtags } = req.body;

  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render('404', { pageTitle: 'Video is not exist' });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  res.redirect('/');
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render('404', { pageTitle: 'Video is not exist' });
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
