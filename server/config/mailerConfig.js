require('dotenv').config();

module.exports = {
  mailtrap: {
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
};
