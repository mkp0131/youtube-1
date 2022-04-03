import express from 'express';
import morgan from 'morgan';
import globalRouter from 'routers/globalRouter';
import userRouter from 'routers/userRouter';
import videoRouter from 'routers/videoRouter';
import bodyParser from 'body-parser';
import routes from 'routes';
import { localMiddleware } from 'middlewares';
import 'db';
import session from 'express-session';

const app = express();
const logger = morgan('dev');

app.use(logger);

app.use(
  session({
    secret: 'secret key', //암호화하는 데 쓰일 키
    resave: false,
    saveUninitialized: false,
  })
);

// form 전송시 사용!
// html form 을 해석해서 JS object 로 생성
app.use(bodyParser.urlencoded({ extended: false }));

// 전역변수 설정
app.use(localMiddleware);

app.set('view engine', 'pug');
app.set('views', './src/views');

app.use(routes.home, globalRouter);
app.use(routes.user, userRouter);
app.use(routes.video, videoRouter);
app.use('/*', (req, res) => {
  res.send('404');
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`⭐ Start Server PORT: ${PORT}`);
});
