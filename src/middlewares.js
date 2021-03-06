import routes from 'routes';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'YTJS';
  res.locals.routes = routes;
  res.locals.noThumnail = '/static/images/thumnail.png';
  res.locals.noProfile = '/static/images/profile.png';
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

// 소셜 로그인인 유저 메인페이지로 리다이렉트
export const profileProtector = (req, res, next) => {
  if (req.session.currentUser.userType === 'email') {
    next();
  } else {
    return res.redirect('/');
  }
};

// S3 세팅
const S3_BUCKET = 'ytjs';
const S3_IMAGE_DIRECTORY = 'images';
const S3_VIDEO_DIRECTORY = 'videos';
const S3_ACL = 'public-read';

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const s3ImageUpLoader = multerS3({
  s3,
  bucket: `${S3_BUCKET}/${S3_IMAGE_DIRECTORY}`,
  acl: `${S3_ACL}`,
});
const s3VideosUpLoader = multerS3({
  s3,
  bucket: `${S3_BUCKET}/${S3_VIDEO_DIRECTORY}`,
  acl: `${S3_ACL}`,
  contentType: multerS3.AUTO_CONTENT_TYPE, // ios 대응
});

// 프로필 사진 업로드
export const photoUpload = multer({
  dest: 'uploads/profile',
  limits: {
    fileSize: 3000000,
  },
  storage: s3ImageUpLoader,
});

// 비디오 업로드
export const videoUpload = multer({
  dest: 'uploads/videos',
  limits: {
    fileSize: 10000000,
  },
  storage: s3VideosUpLoader,
});

// S3 파일삭제
export const s3DeleteMiddleware = (type = 'image') => {
  let directory = `${S3_IMAGE_DIRECTORY}`;
  if (type === 'video') {
    directory = `${S3_VIDEO_DIRECTORY}`;
  }
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const prePhotoUrl = req.session.currentUser.photoUrl;
    if (!prePhotoUrl.includes('ytjs')) {
      return next();
    }

    const targetFile = prePhotoUrl.replace(/.+\//, '');
    s3.deleteObject(
      {
        Bucket: `${S3_BUCKET}`,
        Key: `${directory}/${targetFile}`,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log(`s3 deleteObject`, data);
      }
    );
    next();
  };
};

export const s3DeleteVideo = (fileUrl) => {
  const targetFile = fileUrl.replace(/.+\//, '');
  s3.deleteObject(
    {
      Bucket: `${S3_BUCKET}`,
      Key: `${S3_VIDEO_DIRECTORY}/${targetFile}`,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`s3 deleteObject`, data);
    }
  );
};
