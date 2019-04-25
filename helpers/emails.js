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
/**
 *
 * @param {object} payload The user details, the subject and message for the email
 * @param {boolean} notification determines how the message sent will be formatted
 * @returns {object} The return response by sendmail
 */
const sendMail = async (payload, notification = false) => {
  const {
    email,
    name,
    link,
    subject,
    message
  } = payload;

  const paragraph = (notification === true)
    ? `${message}.`
    : `Please click <a href="${link}">here</a> to ${message}.`;


  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: email,
    subject,
    html: `<h1>Hi ${name}</h1>
      <p>${paragraph}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
