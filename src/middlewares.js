import routes from 'routes';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'YTJS';
  res.locals.routes = routes;

  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.currentUser = req.session.currentUser || {};
  next();
};
