import {
  deleteComment,
  registerView,
  writeComment,
} from 'controllers/videoController';
import express from 'express';
import routes from 'routes';

const apiRouter = express.Router();

apiRouter.post(routes.videoViews, registerView);
apiRouter.post(routes.writeComment, writeComment);
apiRouter.delete(routes.deleteComment, deleteComment);

export default apiRouter;
