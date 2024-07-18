/* const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const authController = require('../controllers/AuthController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.post('/register', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
], userController.createUser);

router.get('/users', authenticateToken, userController.getAllUsers);
router.get('/user/:id', authenticateToken, userController.getUserById);

router.post('/users', [
    check('username').isString().withMessage('Username must be a string'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.createUser);

router.put('/user/:id', [
    check('username').isString().withMessage('Username must be a string'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authenticateToken, userController.updateUser);

router.delete('/user/:id', authenticateToken, userController.deleteUser);

router.post('/login', [
    check('email').isEmail().withMessage('Email must be a string'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.login);

router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
 */

const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/AuthController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', authController.login);
router.get('/users', authenticateToken, userController.getAllUsers);
router.get('/user/:id', authenticateToken, userController.getUserById);
router.post('/add-user', userController.addUser);
router.put('/user/:id', authenticateToken, userController.updateUser);
router.delete('/user/:id', authenticateToken, userController.deleteUser);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
