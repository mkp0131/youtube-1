import { home, search } from 'controllers/videoController';
import express from 'express';
import routes from 'routes';

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.search, search);

export default globalRouter;
