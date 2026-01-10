const isLoggedIn = (req, res, next) => {
  if (!req.userId) {
    res.redirect("/");
    return;
  }
  next();
};

const isNotLoggedIn = (req, res, next) => {
  if (req.userId) {
    res.redirect("/home");
    return;
  }
  next();
};

module.exports = { isLoggedIn, isNotLoggedIn };
