var express = require('express');
var app = express();

app.use(express.static('public'))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

var dotenv = require('dotenv');
dotenv.config();

var session = require('express-session');
var FileStore = require('session-file-store')(session);


app.use(session({ secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore,
    cookie: { maxAge: 9999999,secure: false, httpOnly: true }
  })
);

const check_csrf_token = require('./middlewares/csrfToken').check_csrf_token;
app.use(check_csrf_token);

const generate_csrf_token = require('./helpers/helper').generate_csrf_token;

app.use((req, res, next) => {
  if (req.session.loggedInUser) {
    res.locals.loggedInUser = req.session.loggedInUser;
  } else {
    res.locals.loggedInUser = null;
  }

  res.locals.csrf_token = generate_csrf_token(req);
  next();
});

const bcrypt = require('bcryptjs');

app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//models------------------------------------------------------------------------------------------------------
const sequelize = require('./config/database');
const User = require('./models/user');
const Product = require('./models/product');
const userBoughtProduct = require('./models/usersBoughtProducts');

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
});

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const clientRoutes = require('./routes/client');
app.use('/account/client',clientRoutes);

const vendorRoutes = require('./routes/vendor');
app.use('/account/vendor', vendorRoutes);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const generalRoutes = require('./routes/general');
app.use('/', generalRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


