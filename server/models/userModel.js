const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// ------------ REGISTER -------------------/
const createUser = async (username, email, password, role = 'user') => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const query = {
      text: 'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5 ) RETURNING *',
      values: [id, username, email, hashedPassword, role],
    };
    const res = await pool.query(query);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// ------------ ADD USER -------------------/
const addUser = async (username, email, password, role = 'user') => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const query = {
      text: 'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [id, username, email, hashedPassword, role],
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
    const query = 'SELECT id, username, email, is_locked, lock_until FROM users';
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};


// ------------UPDATE USER BY ID -------------------/
 const updateUser = async (id, username, email, role = 'user') => {
  try {
    const query = {
      text: 'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      values: [username, email, role, id],
    };
    const res = await pool.query(query);
    return res.rows[0];
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
  addUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
