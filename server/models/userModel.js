// userModel.js
const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const createUser = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const query = {
      text: 'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, username, email, hashedPassword],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

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

const updateUser = async (id, username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      values: [username, email, hashedPassword, id],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

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
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
