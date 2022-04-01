import routes from 'routes';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'YTJS';
  res.locals.routes = routes;
  next();
};
