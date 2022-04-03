import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from 'controllers/userController';
import { home, search } from 'controllers/videoController';
import express from 'express';
import routes from 'routes';

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.search, search);

globalRouter.route(routes.join).get(getJoin).post(postJoin);

globalRouter.route(routes.login).get(getLogin).post(postLogin);

globalRouter.get(routes.logout, logout);

export default globalRouter;
