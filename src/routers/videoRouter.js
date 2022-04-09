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
import {
  protectorMiddleware,
  s3DeleteMiddleware,
  videoUpload,
} from 'middlewares';
import routes from 'routes';

const videoRouter = express.Router();

videoRouter.get(routes.video, video);

videoRouter
  .route(routes.upload)
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumnail', maxCount: 1 },
    ]),
    s3DeleteMiddleware('video'),
    postUpload
  );

videoRouter.get(routes.watch(), watch);

videoRouter
  .route(routes.editVideo())
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);

videoRouter.get(routes.deleteVideo(), protectorMiddleware, deleteVideo);

export default videoRouter;
