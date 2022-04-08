import 'regenerator-runtime';
import 'dotenv/config';
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
import MongoStore from 'connect-mongo';
import apiRouter from 'routers/apiRouter';

const app = express();
const logger = morgan('dev');

app.use(logger);

app.use(
  session({
    secret: process.env.COOKIE_SECRET, //암호화하는 데 쓰일 키
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// form 전송시 사용!
// html form 을 해석해서 JS object 로 생성
app.use(bodyParser.urlencoded({ extended: false }));
// json 객체 해석
app.use(express.json());

// 전역변수 설정
app.use(localMiddleware);

// 사진, 동영상 static 폴더
app.use('/uploads', express.static('uploads'));
// css, js static 폴더
app.use('/static', express.static('assets'));

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(routes.home, globalRouter);
app.use(routes.user, userRouter);
app.use(routes.video, videoRouter);
app.use(routes.api, apiRouter);

// 모두 안걸리는 것 404 페이지 처리
app.use('/*', (req, res) => {
  res.send('404');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⭐ Start Server PORT: ${PORT}`);
});
