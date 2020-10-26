const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const passport = require('passport')

const { checkAuthenticated } = require('../config/auth')

// USER MODEL
const User = require('../models/User')

// LOGIN PAGE
router.get('/login', checkAuthenticated, (req, res) => res.render('login'))

// REGISTER PAGE
router.get('/register', (req, res) => res.render('register'))

// REGISTER HANDLE
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []
  // CHECK REQUIRED FIELDS
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' })
  }
  // CHECK PASSWORD MATCH
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' })
  }
  // CHECK PASS LENGTH
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' })
  }
  if (errors.length > 0) {
    console.log(errors)
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    })
  } else {
    // VALIDATION PASS
    User.findOne({ email: email }).then(user => {
      if (user) {
        // USER EXISTS
        errors.push({ msg: 'Email is already registered' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        })
      } else {
        const newUser = new User({
          name,
          email,
          password,
        })

        // HASH PASSWORD
        argon2
          .hash(newUser.password)
          .then(hash => {
            // SET PASSWORD TO HASHED
            newUser.password = hash
            // SAVE USER
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can login')
                res.redirect('/users/login')
              })
              .catch(err => console.log('err1: ', err))
          })
          .catch(err => console.log('err2: ', err))
      }
    })
  }
})

// LOGIN HANDLE
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

// LOGOUT HANDLE
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
