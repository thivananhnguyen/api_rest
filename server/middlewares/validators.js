const { check } = require('express-validator');

// Middleware create USER
const createUserValidator = [
  check('username', 'Username is required').notEmpty(),
  check('email', 'A valid email is required').isEmail(),
  check('password', 'Password is required')
    .notEmpty()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .withMessage('Password must contain at least one digit, one uppercase letter, and one lowercase letter'),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password)
];

// Middleware VERIFIER LOGIN
const loginValidator = [
  check('email', 'A valid email is required').isEmail(),
  check('password', 'Password is required')
    .notEmpty()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .withMessage('Password must contain at least one digit, one uppercase letter, and one lowercase letter'),
  check('recaptchaToken', 'reCAPTCHA token is required').notEmpty() //reCAPTCHA token
];

// Middleware ADD USERS
const addUserValidator = [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required')
      .notEmpty()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
      .withMessage('Password must contain at least one digit, one uppercase letter, and one lowercase letter')
  ];
  
// Middleware UPDATE USER
const updateUserValidator = [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('role', 'Role is required').isIn(['user', 'admin'])
];

module.exports = {
  createUserValidator,
  loginValidator,
  addUserValidator,
  updateUserValidator
};
