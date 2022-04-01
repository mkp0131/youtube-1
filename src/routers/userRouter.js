import express from 'express';

const userRouter = express.Router();

userRouter.get('/', function (req, res) {
  res.send('User');
});

export default userRouter;
