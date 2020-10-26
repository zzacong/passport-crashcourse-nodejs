const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_msg', 'Please login to view this page')
  res.redirect('/users/login')
}

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  }
  next()
}

module.exports = { ensureAuthenticated, checkAuthenticated }
