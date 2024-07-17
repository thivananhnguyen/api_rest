const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const createUser = async (name, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const res = await pool.query('INSERT INTO api_users (id, name, password) VALUES ($1, $2, $3) RETURNING *', [id, name, hashedPassword]);
    return res.rows[0];
};

const getUserById = async (id) => {
    const res = await pool.query('SELECT * FROM api_users WHERE id = $1', [id]);
    return res.rows[0];
};

const getAllUsers = async () => {
    const res = await pool.query('SELECT * FROM api_users');
    return res.rows;
};

const updateUser = async (id, name, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await pool.query('UPDATE api_users SET name = $1, password = $2 WHERE id = $3 RETURNING *', [name, hashedPassword, id]);
    return res.rows[0];
};

const deleteUser = async (id) => {
    const res = await pool.query('DELETE FROM api_users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
};

const getUserByUsername = async (name) => {
    const res = await pool.query('SELECT * FROM api_users WHERE username = $1', [name]);
    return res.rows[0];
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserByUsername,
};
