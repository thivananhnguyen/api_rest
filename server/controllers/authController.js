const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool  = require('../config/dbConfig');

const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    const role= user.role
    if (!user) {
      return res.status(400).json({ success: false, message: 'Cet email n\'est pas encore inscrit. Veuillez vous inscrire.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mot de passe incorrect. Veuillez réessayer.' });
    }


    const client = await pool.connect();
    await client.query('DELETE FROM login_attempts WHERE email = $1', [email]);
    client.release();

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, message: 'Connexion réussie', token, role: role });
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
  }
};

// --------getMe ---------------/
const getMe = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    login,
    getMe,
};
