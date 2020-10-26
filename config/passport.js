const LocalStrategy = require('passport-local').Strategy
const argon2 = require('argon2')

// LOAD USER MODEL
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // MATCH USER
        try {
          const user = await User.findOne({ email: email })
          if (!user) {
            return done(null, false, {
              message: 'That email is not registered',
            })
          }
          try {
            if (await argon2.verify(user.password, password)) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          } catch (error) {
            console.log(error)
          }
        } catch (error) {
          console.log(error)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
