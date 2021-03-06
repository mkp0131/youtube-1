// GLOBAL
const HOME = '/';
const JOIN = '/join';
const LOGIN = '/login';
const LOGINOUT = '/loginout';
const SEARCH = '/search';

// USER
const USER = '/user';
const PROFILE = '/profile';
const EDIT_PROFILE = '/edit';
const DELETE_USER = '/delete';
const EDIT_PASSWORD = '/password';
const GITHUB_LOGIN_START = '/github/start';
const GITHUB_LOGIN_FINISH = '/github/finish';

// VIDEO
const VIDEO = '/video';
const UPLOAD_VIDEO = '/upload';
const WATCH_VIDEO = '/:id([0-9a-f]{24})';
const EDIT_VIDEO = '/:id([0-9a-f]{24})/edit';
const DELETE_VIDEO = '/:id([0-9a-f]{24})/delete';
const SEARCH_VIDEO = '/search';
const MY_VIDEO = '/myvideo';

// api
const API = '/api';
const VIDEO_VIEWS = '/video/:id([0-9a-f]{24})/view';
const WRITE_COMMENT = '/video/:id([0-9a-f]{24})/comment/write';
const DELETE_COMMENT = '/video/:id([0-9a-f]{24})/comment/delete';

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGINOUT,
  user: USER,
  profile: PROFILE,
  editProfile: EDIT_PROFILE,
  myVideo: MY_VIDEO,
  startGithubLogin: GITHUB_LOGIN_START,
  finishGithubLogin: GITHUB_LOGIN_FINISH,
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
  watch: (id) => {
    if (id) {
      return `/video/${id}`;
    } else {
      return WATCH_VIDEO;
    }
  },
  search: SEARCH_VIDEO,
  api: API,
  videoViews: VIDEO_VIEWS,
  writeComment: WRITE_COMMENT,
  deleteComment: DELETE_COMMENT,
  editPassword: EDIT_PASSWORD,
};

export default routes;
