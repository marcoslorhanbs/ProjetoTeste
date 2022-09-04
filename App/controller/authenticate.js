

const authenticate = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated(true)) {
      next();
    } else {
      req.flash('info', 'You must log in to gain access!');
      res.redirect('/');
    }
  }

 module.exports = authenticate;