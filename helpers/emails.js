import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const {
  EMAIL_PASSWORD,
  EMAIL_ADDRESS
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD
  }
});

const sendMail = payload => {
  const { email, name, link } = payload;
  const mailOptions = {
    from: 'ezetech234@gmail.com',
    to: email,
    subject: 'Welcome to Authors Haven',
    html: `<h1>Hi ${name}</h1>
      <p>Please click <a href="${link}">here</a> to verify your account.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export default sendMail;
