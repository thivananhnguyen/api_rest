const { Pool } = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool();

const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const res = await pool.query(
        'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, username, email, hashedPassword]
    );
    return res.rows[0];
};

const getUserById = async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
};

const getAllUsers = async () => {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
};

const updateUser = async (id, username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await pool.query(
        'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
        [username, email, hashedPassword, id]
    );
    return res.rows[0];
};

const deleteUser = async (id) => {
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
};

const getUserByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserByEmail,
};
