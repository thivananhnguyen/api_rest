const express = require('express');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/emailService');
const userModel = require('../models/userModel');
const { jwtSecret } = require('../config/mailerConfig');
const authController = require('../controllers/authController');

const router = express.Router();

//Route sends email validation links
router.post('/send-verification-link', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

    await sendEmail(email, 'Verify Your Email Address', `
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `);

    res.status(200).json({ message: 'Verification link sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
});

// Route Email Authentication
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
