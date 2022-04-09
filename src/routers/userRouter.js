import {
  finishGithubLogin,
  getProfile,
  getEditProfile,
  postEditProfile,
  startGithubLogin,
  getEditPassword,
  postEditPassword,
  myVideo,
} from 'controllers/userController';
import express from 'express';
import {
  photoUpload,
  profileProtector,
  protectorMiddleware,
  s3DeleteMiddleware,
} from 'middlewares';
import routes from 'routes';

const userRouter = express.Router();

userRouter.route(`${routes.profile}`).all(protectorMiddleware).get(getProfile);

userRouter
  .route(`${routes.editProfile}`)
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(
    photoUpload.single('photo'),
    s3DeleteMiddleware('image'),
    postEditProfile
  );

userRouter
  .route(`${routes.editPassword}`)
  .all(profileProtector)
  .get(getEditPassword)
  .post(postEditPassword);

userRouter.route(`${routes.myVideo}`).all(protectorMiddleware).get(myVideo);

userRouter.get(`${routes.startGithubLogin}`, startGithubLogin);

userRouter.get(`${routes.finishGithubLogin}`, finishGithubLogin);

export default userRouter;
