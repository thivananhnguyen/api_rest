const nodemailer = require('nodemailer');
const { mailtrap } = require('../config/mailerConfig');

const transporter = nodemailer.createTransport(mailtrap);

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"My Admin Dashboard" <no-reply@example.com>',
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
