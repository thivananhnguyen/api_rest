const pool = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

// ------------ REGISTER -------------------/
const createUser = async (username, email, password, role = 'user') => {
  try {
    const id = uuidv4();
    const query = {
      text: 'INSERT INTO users (id, username, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, username, email, password, role, false], // Set default is_verified to false
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


//------------ updateUserVerification -------------------/
const updateUserVerification = async (email) => {
  try {
    const query = {
      text: 'UPDATE users SET is_verified = TRUE WHERE email = $1 RETURNING *',
      values: [email],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error updating user verification:', error);
    throw error;
  }
};


// ------------ ADD USER -------------------/
const addUser = async (username, email, password, role = 'user', isVerified = false) => {
  try {
    const id = uuidv4();
    const query = {
      text: 'INSERT INTO users (id, username, email, password, role, is_verified ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, username, email, password, role, isVerified ],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// ------------ USER BY ID-------------------/
const getUserById = async (id) => {
  try {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};


// ------------ ALL USERS -------------------/
const getAllUsers = async () => {
  try {
    const query = 'SELECT * FROM users';
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// ------------UPDATE USER BY ID -------------------/
const updateUser = async (id, username, email) => {
  try {
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userRes = await pool.query(userQuery, [id]);

    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }

    const currentUser = userRes.rows[0];

    const updatedUsername = username || currentUser.username;
    const updatedEmail = email || currentUser.email;

    const updateQuery = `
      UPDATE users 
      SET username = $1, email = $2
      WHERE id = $3
      RETURNING *;
    `;
    const updateValues = [updatedUsername, updatedEmail, id];
    const updateRes = await pool.query(updateQuery, updateValues);

    return updateRes.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ------------ DELETE USER BY ID -------------------/
const deleteUser = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING *',
      values: [id],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ------------ USER BY EMAIL -------------------/
const getUserByEmail = async (email) => {
  try {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  updateUserVerification,
  addUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
