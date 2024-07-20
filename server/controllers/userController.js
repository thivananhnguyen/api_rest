const { /* check, */ validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const escapeHtml = require('../helpers/escapeHtml');
const { validateEmail, validatePassword } = require('../helpers/validation');
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

/* ------------------ CREATE USER ----------------------*/
const createUser = async (req, res) => {
  const { username, email, password/* , confirmPassword */ } = req.body;
  
  // Escape HTML characters
  const escapedUsername = escapeHtml(username);
  const escapedEmail = escapeHtml(email);
  const escapedPassword = escapeHtml(password);

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Format de courriel invalide' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if email already exists
    const existingUser = await userModel.getUserByEmail(escapedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà enregistré' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(escapedPassword, 10);

    // Add user to the database
    const newUser = await userModel.createUser(escapedUsername, escapedEmail, hashedPassword);

    return res.status(201).json({ success: true, message: 'Utilisateur enregistré avec succès', user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    let errorMessage = "Erreur lors de l'inscription";
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email existe déjà. Veuillez choisir une autre adresse e-mail.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Le mot de passe doit comporter au moins 8 caractères.';
    }

    res.status(500).send({ message: errorMessage });
  }
};


/* ------------------ ADD USER ----------------------*/
const addUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { username, email, password,  role = 'user' } = req.body;
     
    try {
      // Check if email already exists
      const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already added' });
        }
  
      // Escape HTML characters
      const escapedUsername = escapeHtml(username.trim());
      const escapedEmail = escapeHtml(email.trim());
      const escapedPassword = await bcrypt.hash(password.trim(), 10);
  
      // Add user to database
      const newUser = await userModel.addUser(escapedUsername, escapedEmail, escapedPassword, role);
      return res.status(201).json({ success: true, message: 'Utilisateur ajouter avec succès', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

/* ------------------ UPDATE USER ----------------------*/
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { username, email, role } = req.body;

  // Escape and trim inputs
  const escapedUsername = escapeHtml(username.trim());
  const escapedEmail = escapeHtml(email.trim());

  try {
      // Check if email already exists
      const existingUser = await userModel.getUserByEmail(escapedEmail);
      if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ message: 'Email already exists' });
      }

      const updatedUser = await userModel.updateUser(id, escapedUsername, escapedEmail, role);

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(201).json({ success: true, message: 'User updated successfully!', user: updatedUser }); 
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
};

/* ------------------ DELETE USER ----------------------*/
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
    addUser,
    updateUser,
    deleteUser,
};
