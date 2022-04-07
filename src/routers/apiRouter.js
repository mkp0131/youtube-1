import { registerView } from 'controllers/videoController';
import express from 'express';
import routes from 'routes';

const apiRouter = express.Router();

apiRouter.post(routes.videoViews, registerView);

export default apiRouter;
