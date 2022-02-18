module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    const err = new Error('Пользователь не залогинен');
    err.status = 401;
    throw err;
  }

  return next();
};
