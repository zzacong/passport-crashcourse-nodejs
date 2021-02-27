const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// WELCOME PAGE
router.get('/', (req, res) => res.render('Welcome'))

// DASHBOARD
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    name: req.user.name,
  })
)

module.exports = router
