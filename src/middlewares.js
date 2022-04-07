import routes from 'routes';
import multer from 'multer';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'YTJS';
  res.locals.routes = routes;
  res.locals.noThumnail = 'uploads/images/thumnail.png';
  res.locals.noProfile = '/uploads/images/profile.png';
  res.locals.noDisplayName = '별명을 지어주세요.';
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.currentUser = req.session.currentUser || {};
  next();
};

// 로그인이 안되어 있는 유저 login 페이지로 리다이렉트
export const protectorMiddleware = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    return res.redirect('/login');
  }
};

// 로그인 되어있는 유저 메인페이지로 리다이렉트
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    next();
  } else {
    return res.redirect('/');
  }
};

// 프로필 사진 업로드
export const photoUpload = multer({
  dest: 'uploads/profile',
  limits: {
    fileSize: 3000000,
  },
});

// 비디오 업로드
export const videoUpload = multer({
  dest: 'uploads/videos',
  limits: {
    fileSize: 10000000,
  },
});
