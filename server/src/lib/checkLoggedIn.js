const checkLoggedIn = (ctx, next) => {
  // console.log(ctx.state);
  if (!ctx.state.user) {
    ctx.status = 401; // Unauthorized
    return;
  }
  return next();
}

export default checkLoggedIn;