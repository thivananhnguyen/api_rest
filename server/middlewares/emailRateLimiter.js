/* const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

const emailRateLimiter = async (req, res, next) => {
  const { email, password } = req.body;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  let client;
  try {
    client = await pool.connect();
    const now = new Date();

    // Lấy thông tin người dùng từ bảng users
    const userResult = await client.query(`
      SELECT id, username, email, password, role
      FROM users
      WHERE email = $1
    `, [email]);

    console.log('User result:', userResult.rows);

    if (userResult.rows.length === 0) {
      // Email không tồn tại trong hệ thống
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isMatch);

    if (isMatch) {
      // Nếu mật khẩu đúng, xóa tất cả các lần đăng nhập thất bại (nếu có)
      await client.query('DELETE FROM login_attempts WHERE email = $1', [email]);
      return next();
    } else {
      // Mật khẩu không đúng
      if (user.role !== 'admin') {
        // Nếu người dùng không phải là admin, xử lý ghi lại các lần đăng nhập thất bại và áp dụng giới hạn tỷ lệ
        const loginAttemptResult = await client.query(`
          SELECT attempts, last_attempt, locked_until
          FROM login_attempts
          WHERE email = $1
        `, [email]);

        console.log('Login attempt result:', loginAttemptResult.rows);

        const timeNow = new Date();

        if (loginAttemptResult.rows.length > 0) {
          const loginAttempt = loginAttemptResult.rows[0];

          if (loginAttempt.locked_until && loginAttempt.locked_until > timeNow) {
            const timeRemaining = loginAttempt.locked_until - timeNow;
            return res.status(429).json({
              success: false,
              message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${Math.ceil(timeRemaining / 1000 / 60)} phút.`
            });
          }

          if (loginAttempt.attempts >= MAX_ATTEMPTS && now - loginAttempt.last_attempt < LOCK_TIME) {
            const lockUntil = new Date(now.getTime() + LOCK_TIME);
            await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1, locked_until = $2 WHERE email = $3', [now, lockUntil, email]);
            return res.status(429).json({
              success: false,
              message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${Math.ceil(LOCK_TIME / 1000 / 60)} phút.`
            });
          } else if (now - loginAttempt.last_attempt >= LOCK_TIME) {
            await client.query('UPDATE login_attempts SET attempts = 1, last_attempt = $1, locked_until = NULL WHERE email = $2', [now, email]);
          } else {
            await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1 WHERE email = $2', [now, email]);
          }
        } else {
          await client.query('INSERT INTO login_attempts (email, attempts, last_attempt, locked_until) VALUES ($1, $2, $3, NULL)', [email, 1, now]);
        }
      }

      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra các lần đăng nhập:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  } finally {
    if (client) client.release();
  }
};

module.exports = emailRateLimiter; */
const pool = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

const emailRateLimiter = async (req, res, next) => {
  const { email, password } = req.body;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  let client;
  try {
    client = await pool.connect();
    const now = new Date();

    // Lấy thông tin người dùng từ bảng users
    const userResult = await client.query(`
      SELECT id, username, email, password, role
      FROM users
      WHERE email = $1
    `, [email]);

    console.log('User result:', userResult.rows);

    if (userResult.rows.length === 0) {
      // Email không tồn tại trong hệ thống
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isMatch);

    if (isMatch) {
      // Nếu mật khẩu đúng, xóa tất cả các lần đăng nhập thất bại (nếu có)
      await client.query('DELETE FROM login_attempts WHERE email = $1', [email]);
      return next();
    } else {
      // Mật khẩu không đúng
      if (user.role !== 'admin') {
        // Nếu người dùng không phải là admin, xử lý ghi lại các lần đăng nhập thất bại và áp dụng giới hạn tỷ lệ
        const loginAttemptResult = await client.query(`
          SELECT attempts, last_attempt, locked_until
          FROM login_attempts
          WHERE email = $1
        `, [email]);

        console.log('Login attempt result:', loginAttemptResult.rows);

        const timeNow = new Date();

        if (loginAttemptResult.rows.length > 0) {
          const loginAttempt = loginAttemptResult.rows[0];

          if (loginAttempt.locked_until && loginAttempt.locked_until > timeNow) {
            const timeRemaining = loginAttempt.locked_until - timeNow;
            return res.status(429).json({
              success: false,
              message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${Math.ceil(timeRemaining / 1000 / 60)} phút.`
            });
          }

          if (loginAttempt.attempts >= MAX_ATTEMPTS && now - loginAttempt.last_attempt < LOCK_TIME) {
            const lockUntil = new Date(now.getTime() + LOCK_TIME);
            await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1, locked_until = $2 WHERE email = $3', [now, lockUntil, email]);
            return res.status(429).json({
              success: false,
              message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${Math.ceil(LOCK_TIME / 1000 / 60)} phút.`
            });
          } else if (now - loginAttempt.last_attempt >= LOCK_TIME) {
            await client.query('UPDATE login_attempts SET attempts = 1, last_attempt = $1, locked_until = NULL WHERE email = $2', [now, email]);
          } else {
            await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1 WHERE email = $2', [now, email]);
          }
        } else {
          await client.query('INSERT INTO login_attempts (email, attempts, last_attempt, locked_until) VALUES ($1, $2, $3, NULL)', [email, 1, now]);
        }
      }

      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không hợp lệ' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra các lần đăng nhập:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  } finally {
    if (client) client.release();
  }
};

module.exports = emailRateLimiter;
