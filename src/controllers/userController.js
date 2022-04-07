import User from 'models/User';
import bcrypt from 'bcrypt';
import routes from 'routes';
import fetch from 'node-fetch';

export const getJoin = async (req, res) => {
  return res.render('user/join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { email, password, password2, displayName } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).render('user/join', {
      pageTitle: 'Join',
      errMsg: '이미 가입된 이메일 입니다.',
    });
  }

  if (password !== password2) {
    return res.render('user/join', {
      pageTitle: 'Join',
      errMsg: '암호를 확인해주세요.',
    });
  }

  try {
    const createUser = await User.create({
      email,
      password,
      displayName,
    });

    req.session.isLoggedIn = true;
    req.session.currentUser = createUser;

    return res.redirect('/');
  } catch (error) {
    console.log(error);
    return res.render('user/join', {
      pageTitle: 'Join',
      errMsg: '회원가입 서식을 확인해주세요.',
    });
  }

  return res.redirect('/');
};

export const getLogin = async (req, res) => {
  return res.render('user/login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).render('user/login', {
      pageTitle: 'Login',
      errMsg: '아이디가 없습니다.',
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (comparePassword !== true) {
    return res.status(400).render('user/login', {
      pageTitle: 'Login',
      errMsg: '비밀번호가 맞지 않습니다.',
    });
  }

  req.session.isLoggedIn = true;
  req.session.currentUser = user;

  return res.redirect('/');
};

export const logout = async (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

export const getProfile = (req, res) => {
  res.render('user/profile');
};

export const getEditProfile = async (req, res) => {
  res.render('user/editProfile');
};

export const postEditProfile = async (req, res) => {
  const {
    session: {
      currentUser: { _id },
    },
    body: { displayName },
    file: { path: photoUrl },
  } = req;

  let user;
  try {
    user = await User.findByIdAndUpdate(_id, {
      displayName,
      photoUrl: '/' + photoUrl,
    }).setOptions({ runValidators: true });
  } catch (error) {
    return res.render('user/profile', {
      pageTitle: 'Edit Profile',
      errMsg: error._message,
    });
  }

  if (user) {
    req.session.currentUser = user;
  }

  return res.redirect(`${routes.user}${routes.editProfile}`);
};

export const startGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize?';

  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: false,
    scope: 'read:user user:email',
  };

  // 깃허브 로그인 페이지로 유저 전송
  res.redirect(`${baseUrl}${new URLSearchParams(config).toString()}`);
};

export const finishGithubLogin = async (req, res) => {
  const code = req.query.code;
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };
  // 깃허브에서 준 code 로 토큰 요청
  const tokenReq = await (
    await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  ).json();

  // 토큰을 제대로 받아왔는지 검증
  if ('access_token' in tokenReq) {
    // 토큰으로 user data 요청
    const userData = await (
      await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tokenReq.access_token}`,
        },
      })
    ).json();

    let email;
    if (!userData.email) {
      // 이메일이 없는 경우 이메일만 다시 요청
      const emailList = await (
        await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${tokenReq.access_token}`,
          },
        })
      ).json();

      // 이메일 리스트중 인증이 된 것만 뽑기
      email = emailList.find((email) => email.primary && email.verified)?.email;
    }

    // 이메일이 제대로 있는지 검증
    if (!email) {
      return res.status(400).render('user/login', {
        pageTitle: 'Login',
        errMsg: '인증 오류가 발생했습니다.',
      });
    }

    const user = await User.findOne({ email });

    // 이미 이메일이 등록이 되어있을 경우 로그인!
    if (user) {
      if (user.userType === 'github') {
        req.session.isLoggedIn = true;
        req.session.currentUser = user;

        return res.redirect('/');
      } else {
        return res.render('user/login', {
          pageTitle: 'Login',
          errMsg: user.userType + '으로 계정이 등록되어 있습니다.',
        });
      }
    }

    // 이메일 등록이 안되어있는 경우 회원가입
    let createUser;
    try {
      createUser = await User.create({
        email,
        displayName: userData.name,
        photoUrl: userData.avatar_url,
        userType: 'github',
      });
    } catch (error) {
      console.log(error);
      return res.render('user/login', {
        pageTitle: 'Login',
        errMsg: '깃허브 계정을 확인해주세요.',
      });
    }

    req.session.isLoggedIn = true;
    req.session.currentUser = createUser;
    return res.redirect('/');
  }

  return res.redirect('/');
};
