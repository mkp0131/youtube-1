import {
  finishGithubLogin,
  getProfile,
  getEditProfile,
  postEditProfile,
  startGithubLogin,
} from 'controllers/userController';
import express from 'express';
import { photoUpload, protectorMiddleware } from 'middlewares';
import routes from 'routes';

const userRouter = express.Router();

userRouter.route(`${routes.profile}`).all(protectorMiddleware).get(getProfile);

userRouter
  .route(`${routes.editProfile}`)
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(photoUpload.single('photo'), postEditProfile);

userRouter.get(`${routes.startGithubLogin}`, startGithubLogin);

userRouter.get(`${routes.finishGithubLogin}`, finishGithubLogin);

export default userRouter;
