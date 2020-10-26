const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// PASSPORT CONFIG
require('./config/passport')(passport)

// DB CONFIG
const db = require('./config/keys').MongoUri

// CONNECT TO MONGODB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BODYPARSER
app.use(express.urlencoded({ extended: false }))

// EXPRESS SESSION
// app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
)

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

// CONNECT FLASH
app.use(flash())

// GLOBAL VARS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// ROUTES
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
