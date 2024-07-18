const { check, validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const createUser = async (req, res) => {
    await check('username', 'Username is required').notEmpty().run(req);
    await check('email', 'Valid email is required').isEmail().run(req);
    await check('password', 'Password is required')
        .notEmpty()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/)
        .withMessage('Password must contain at least one digit, one uppercase letter, one lowercase letter, and one special character');
    await check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const user = await userModel.createUser(username, email, password);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const updateUser = async (req, res) => {
    await check('username', 'Username is required').notEmpty().run(req);
    await check('email', 'Valid email is required').isEmail().run(req);
    await check('password', 'Password is required').notEmpty().run(req);
    await check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const user = await userModel.updateUser(id, username, email, password);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.deleteUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
