const User = require("../models/user");
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');

const register = (req, res) => {
  res.render('pages/auth/register');
};

const registerSuccess = (req, res) => {
  res.render('pages/auth/register-success');
};


const userSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
  type: Joi.string().required()
});

const registerPost = async (req, res) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    const existingUser = await User.findOne({ where: { email: value.email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const password = await bcrypt.hash(value.password, 8);
    const sanitizedData = {
      name: sanitizeHtml(value.name),
      email: sanitizeHtml(value.email), 
      password,
      type: value.type
    };
    const user = await User.create(sanitizedData);

    res.render('pages/auth/register-success', { user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).render('pages/auth/register', {
      error: error.message || 'Failed to register user'
    });
  }
};


const login = (req, res) => {
  if (req.session.loggedInUser) {
    return res.redirect('/');
  }else{
    res.render('pages/auth/login');
  }
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const saveRedirect = req.session.redirectTo;

  if (email && password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).render('pages/auth/login', { error: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).render('pages/auth/login', { error: 'Invalid email or password' });
      }

      req.session.loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      };

      console.log('User logged in:', req.session.loggedInUser);

      delete req.session.redirectTo;
      if (saveRedirect) {
        res.redirect(saveRedirect);
      }
       else {
        res.redirect('/');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};
  
const logout = (req, res) => {
  delete req.session.loggedInUser;
  req.session.save(function(err) {
    if (err) {
      console.error('Eroare la salvarea sesiunii:', err);
    } else {
      res.redirect('/');
    }
  });
};

module.exports = {
  register,
  registerSuccess,
  registerPost,
  login,
  loginPost,
  logout
};