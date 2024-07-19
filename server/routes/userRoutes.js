const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/AuthController');
const {authenticateToken, authenticateTokenAdmin }= require('../middlewares/authenticateToken');
const emailRateLimiter = require('../middlewares/emailRateLimiter');
const router = express.Router();

// Public routes
router.post('/register', userController.createUser);
router.post('/login', emailRateLimiter,  authController.login);

// Admin protected routes
router.get('/users', authenticateTokenAdmin, userController.getAllUsers);
router.get('/user/:id', authenticateTokenAdmin, userController.getUserById);
router.post('/add-user', authenticateTokenAdmin,userController.addUser);
router.put('/user/:id', authenticateTokenAdmin, userController.updateUser);
router.delete('/user/:id', authenticateTokenAdmin, userController.deleteUser);

// User-specific route with token authentication
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
