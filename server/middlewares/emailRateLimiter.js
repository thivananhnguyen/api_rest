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

    const userResult = await client.query(`
      SELECT id, username, email, password, role, is_locked, lock_until
      FROM users
      WHERE email = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Cet email n\'est pas encore inscrit. Veuillez vous inscrire.' });
    }

    const user = userResult.rows[0];

    if (user.is_locked && user.lock_until > now) {
      const timeRemaining = user.lock_until - now;
      return res.status(429).json({
        success: false,
        message: `Votre compte est verrouillé. Veuillez réessayer après ${Math.ceil(timeRemaining / 1000 / 60)} minutes.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      await client.query('DELETE FROM login_attempts WHERE email = $1', [email]);

      if (user.is_locked) {
        await client.query('UPDATE users SET is_locked = FALSE, lock_until = NULL WHERE email = $1', [email]);
      }

      return next();
    } else {
      if (user.role !== 'admin') {
        const loginAttemptResult = await client.query(`
          SELECT attempts, last_attempt, locked_until
          FROM login_attempts
          WHERE email = $1
        `, [email]);

        const timeNow = new Date();

        if (loginAttemptResult.rows.length > 0) {
          const loginAttempt = loginAttemptResult.rows[0];

          if (loginAttempt.locked_until && loginAttempt.locked_until > timeNow) {
            const timeRemaining = loginAttempt.locked_until - timeNow;
            return res.status(429).json({
              success: false,
              message: `Votre compte est verrouillé. Veuillez réessayer après ${Math.ceil(timeRemaining / 1000 / 60)} minutes.`
            });
          }

          if (loginAttempt.attempts >= MAX_ATTEMPTS && now - loginAttempt.last_attempt < LOCK_TIME) {
            const lockUntil = new Date(now.getTime() + LOCK_TIME);
            await client.query('UPDATE login_attempts SET attempts = attempts + 1, last_attempt = $1, locked_until = $2 WHERE email = $3', [now, lockUntil, email]);

            await client.query('UPDATE users SET is_locked = TRUE, lock_until = $1 WHERE email = $2', [lockUntil, email]);

            return res.status(429).json({
              success: false,
              message: `Votre compte est verrouillé. Veuillez réessayer après ${Math.ceil(LOCK_TIME / 1000 / 60)} minutes.`
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

      return res.status(401).json({ success: false, message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des tentatives de connexion:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  } finally {
    if (client) client.release();
  }
};

module.exports = emailRateLimiter;
