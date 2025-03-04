const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
