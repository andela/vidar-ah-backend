import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const {
  EMAIL_PASSWORD,
  EMAIL_ADDRESS,
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

const sendMail = (payload) => {
  const {
    email,
    name,
    link,
    subject,
    message
  } = payload;

  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: email,
    subject,
    html: `<h1>Hi ${name}</h1>
      <p>Please click <a href="${link}">here</a> to ${message}.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export default sendMail;
