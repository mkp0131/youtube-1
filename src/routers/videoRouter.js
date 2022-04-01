import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  video,
  watch,
} from 'controllers/videoController';
import express from 'express';
import routes from 'routes';

const videoRouter = express.Router();

videoRouter.get(routes.video, video);

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, postUpload);

videoRouter.get(routes.watch, watch);

videoRouter.get(routes.editVideo(), getEdit);
videoRouter.post(routes.editVideo(), postEdit);

videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;
