/* const pool = require('../config/dbConfig');

const emailRateLimiter = async (req, res, next) => {
  const { email } = req.body;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 1 * 60 * 1000; // 15 minutes

  try {
    const client = await pool.connect();
    const now = new Date();

    // Lấy thông tin người dùng từ bảng users
    const userResult = await client.query(`
      SELECT id, username, email, is_locked, lock_until
      FROM users
      WHERE email = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const user = userResult.rows[0];

    // Kiểm tra trạng thái khóa của người dùng
    if (user.is_locked && user.lock_until > now) {
      const timeRemaining = user.lock_until - now;
      client.release();
      return res.status(429).json({
        success: false,
        message: `Trop de tentatives de connexion depuis cet email, veuillez réessayer après ${Math.ceil(timeRemaining / 1000 / 60)} minutes`
      });
    }

    // Lấy thông tin từ bảng login_attempts
    const loginAttemptResult = await client.query(`
      SELECT attempts, last_attempt
      FROM login_attempts
      WHERE email = $1
    `, [email]);

    if (loginAttemptResult.rows.length > 0) {
      const loginAttempt = loginAttemptResult.rows[0];

      if (loginAttempt.attempts >= MAX_ATTEMPTS && now - loginAttempt.last_attempt < LOCK_TIME) {
        const lockUntil = new Date(now.getTime() + LOCK_TIME);
        await client.query('UPDATE users SET is_locked = $1, lock_until = $2 WHERE email = $3', [true, lockUntil, email]);
        client.release();
        return res.status(429).json({
          success: false,
          message: `Trop de tentatives de connexion depuis cet email, veuillez réessayer après 15 minutes`
        });
      } else if (now - loginAttempt.last_attempt >= LOCK_TIME) {
        await client.query('UPDATE login_attempts SET attempts = 1, last_attempt = $1 WHERE email = $2', [now, email]);
      } else {
        await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1 WHERE email = $2', [now, email]);
      }
    } else {
      await client.query('INSERT INTO login_attempts (email, attempts, last_attempt) VALUES ($1, $2, $3)', [email, 1, now]);
    }

    // Đặt lại trạng thái khóa của người dùng nếu cần
    await client.query('UPDATE users SET is_locked = $1, lock_until = $2 WHERE email = $3', [false, null, email]);

    client.release();
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification des tentatives de connexion:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

module.exports = emailRateLimiter;
 */

const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

const emailRateLimiter = async (req, res, next) => {
  const { email, password } = req.body;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 1 * 60 * 1000; // 1 minute

  try {
    const client = await pool.connect();
    const now = new Date();

    // Lấy thông tin người dùng từ bảng users
    const userResult = await client.query(`
      SELECT id, username, email, password, is_locked, lock_until
      FROM users
      WHERE email = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const user = userResult.rows[0];

    // Kiểm tra trạng thái khóa của người dùng
    if (user.is_locked && user.lock_until > now) {
      const timeRemaining = user.lock_until - now;
      client.release();
      return res.status(429).json({
        success: false,
        message: `Trop de tentatives de connexion depuis cet email, veuillez réessayer après ${Math.ceil(timeRemaining / 1000 / 60)} minutes`
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Đăng nhập thành công
      await client.query('DELETE FROM login_attempts WHERE email = $1', [email]);
      await client.query('UPDATE users SET is_locked = $1, lock_until = $2 WHERE email = $3', [false, null, email]);
      client.release();
      return next();
    }

    // Lấy thông tin từ bảng login_attempts
    const loginAttemptResult = await client.query(`
      SELECT attempts, last_attempt
      FROM login_attempts
      WHERE email = $1
    `, [email]);

    if (loginAttemptResult.rows.length > 0) {
      const loginAttempt = loginAttemptResult.rows[0];

      if (loginAttempt.attempts >= MAX_ATTEMPTS && now - loginAttempt.last_attempt < LOCK_TIME) {
        const lockUntil = new Date(now.getTime() + LOCK_TIME);
        await client.query('UPDATE users SET is_locked = $1, lock_until = $2 WHERE email = $3', [true, lockUntil, email]);
        client.release();
        return res.status(429).json({
          success: false,
          message: `Trop de tentatives de connexion depuis cet email, veuillez réessayer après 15 minutes`
        });
      } else if (now - loginAttempt.last_attempt >= LOCK_TIME) {
        await client.query('UPDATE login_attempts SET attempts = 1, last_attempt = $1 WHERE email = $2', [now, email]);
      } else {
        await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1 WHERE email = $2', [now, email]);
      }
    } else {
      await client.query('INSERT INTO login_attempts (email, attempts, last_attempt) VALUES ($1, $2, $3)', [email, 1, now]);
    }

    client.release();
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    console.error('Erreur lors de la vérification des tentatives de connexion:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

module.exports = emailRateLimiter;
