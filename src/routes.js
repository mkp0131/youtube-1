// GLOBAL
const HOME = '/';
const JOIN = '/join';
const LOGIN = '/login';
const SEARCH = '/search';

// USER
const USER = '/user';
const EDIT_PROFILE = '/edit';
const DELETE_USER = '/delete';

// VIDEO
const VIDEO = '/video';
const UPLOAD_VIDEO = '/upload';
const WATCH_VIDEO = '/:id([0-9a-f]{24})';
const EDIT_VIDEO = '/:id([0-9a-f]{24})/edit';
const DELETE_VIDEO = '/:id([0-9a-f]{24})/delete';
const SEARCH_VIDEO = '/search';

const routes = {
  home: HOME,
  user: USER,
  video: VIDEO,
  editVideo: (id) => {
    if (id) {
      return `${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: (id) => {
    if (id) {
      return `${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  upload: UPLOAD_VIDEO,
  watch: WATCH_VIDEO,
  search: SEARCH_VIDEO,
};

export default routes;
