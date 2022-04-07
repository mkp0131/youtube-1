import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from 'controllers/userController';
import { home, search } from 'controllers/videoController';
import express from 'express';
import { protectorMiddleware, publicOnlyMiddleware } from 'middlewares';
import routes from 'routes';

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.search, search);

globalRouter
  .route(routes.join)
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);

globalRouter
  .all(publicOnlyMiddleware)
  .route(routes.login)
  .get(getLogin)
  .post(postLogin);

globalRouter.get(routes.logout, protectorMiddleware, logout);

export default globalRouter;
