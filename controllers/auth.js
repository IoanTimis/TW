const User = require("../models/user");
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');
const { check_csrf_token } = require("../middlewares/csrfToken");

const register = (req, res) => {
    res.render('pages/auth/register');
};

const registerSuccess = (req, res) => {
    res.render('pages/auth/register-success');
};

const registerPost = async (req, res) => {
    try {
        const userSchema = Joi.object({
            name: Joi.string().required().min(3).max(30).messages({
                "string.empty": "Numele este obligatoriu.",
                "string.min": "Numele trebuie să aibă cel puțin 3 caractere.",
                "string.max": "Numele poate avea maxim 30 de caractere."
            }),
            email: Joi.string().email().required().messages({
                "string.email": "Adresa de email nu este validă.",
                "string.empty": "Email-ul este obligatoriu."
            }),
            password: Joi.string().min(6).required().messages({
                "string.min": "Parola trebuie să aibă cel puțin 6 caractere.",
                "string.empty": "Parola este obligatorie."
            }),
            passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
                "any.only": "Parolele nu se potrivesc.",
                "string.empty": "Confirmarea parolei este obligatorie."
            }),
            type: Joi.string().required().messages({
                "string.empty": "Tipul de utilizator este obligatoriu."
            }),
            csrf_token: Joi.string().required()
        });

        const { error, value } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ errors: errorMessages });
        }

        const existingUser = await User.findOne({ where: { email: value.email } });
        if (existingUser) {
            return res.status(400).json({ errors: ["Email already in use"] });
        }

        const password = await bcrypt.hash(value.password, 8);
        const sanitizedData = {
            name: sanitizeHtml(value.name),
            email: sanitizeHtml(value.email),
            password,
            type: value.type
        };

        const user = await User.create(sanitizedData);
        return res.render('pages/auth/register-success', { user });
    } catch (error) {
        const errorMessage = error.details ? error.details.map(detail => detail.message).join(', ') : error.message;
        console.error('Erori de validare:', errorMessage);
        return res.status(400).render('pages/auth/register', { error: errorMessage });
    }
};

const login = (req, res) => {
    if (req.session.loggedInUser) {
        return res.redirect('/');
    } else {
        res.render('pages/auth/login');
    }
};

const loginPost = async (req, res) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Adresa de email nu este validă.",
            "string.empty": "Email-ul este obligatoriu."
        }),
        password: Joi.string().required().messages({
            "string.empty": "Parola este obligatorie."
        }),
        csrf_token: Joi.string().required()
    });

    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).render('pages/auth/login', { errors: errorMessages });
    }

    const { email, password } = value;
    const saveRedirect = req.session.redirectTo;

    if (email && password) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).render('pages/auth/login', { errors: ['Invalid email or password'] });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).render('pages/auth/login', { errors: ['Invalid email or password'] });
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
            } else {
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
