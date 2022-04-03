import User from 'models/User';

export const getJoin = async (req, res) => {
  return res.render('user/join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { email, password, password2, displayName } = req.body;

  if (password !== password2) {
    return res.render('user/join', {
      pageTitle: 'Join',
      errMsg: '암호를 확인해주세요.',
    });
  }

  try {
    await User.create({
      email,
      password,
      password2,
      displayName,
    });
  } catch (error) {
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

  if (user.password !== password) {
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
