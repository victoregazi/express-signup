//dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

//DB connection
const db = require('./config/keys').MongoURI;

// CONNECT TO MONGODB

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

// ejs middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./routes/app'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`server started on port ${PORT}`));