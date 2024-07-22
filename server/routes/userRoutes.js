const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const {authenticateToken, authenticateTokenAdmin }= require('../middlewares/authenticateToken');
const emailRateLimiter = require('../middlewares/emailRateLimiter');
const {createUserValidator, loginValidator, addUserValidator, updateUserValidator } = require('../middlewares/validators');
const router = express.Router();

// Public routes
router.post('/register', createUserValidator, userController.createUser);
router.post('/verify-email', authController.verifyEmail); // Route Email Authentication
router.post('/login',  loginValidator, emailRateLimiter,  authController.login);

// Admin protected routes
router.get('/users', authenticateTokenAdmin, userController.getAllUsers);
router.get('/user/:id', authenticateTokenAdmin, userController.getUserById);
router.post('/add-user', authenticateTokenAdmin, addUserValidator, userController.addUser);
router.put('/user/:id', authenticateTokenAdmin, updateUserValidator,userController.updateUser);
router.delete('/user/:id', authenticateTokenAdmin, userController.deleteUser);

// User-specific route with token authentication
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
