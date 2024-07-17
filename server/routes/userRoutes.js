/* const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes
router.get('/users', authMiddleware, userController.getAllUsers);
router.get('/user/:id', authMiddleware, userController.getUserById);
router.post('/user', authMiddleware, userController.createUser);
router.put('/user/:id', authMiddleware, userController.updateUser);
router.delete('/user/:id', authMiddleware, userController.deleteUser);

module.exports = router; */
// src/routes/userRoutes.js
const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/users', [
    check('username').isString(),
    check('password').isLength({ min: 6 })
], userController.createUser);
router.put('/user/:id', [
    check('username').isString(),
    check('password').isLength({ min: 6 })
], userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
