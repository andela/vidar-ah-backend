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


const emailTemplate = ({ name, link, message }) => `
<div
  style="background-color: #E6E6E6;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1px;
    margin: 0;
    padding-top: 80px;
    font-weight: 100;
    height: 600px"
  >
  <div
    style="height: 570px;
    background-color: #FFFFFF;
    width: 750px;
    padding-top: 0;
    margin: 0 auto;"
  >
    <div
      style="height: 60px;
        border-radius: 0 0 4px 4px; width: 610px;
        background-color: #8932b4;
        width: 750px;
        padding-top: 20px;             
        margin-top: 0;
        text-align: center"
  >
    <div
      style="
        color: white;
        font-family: "DIN Pro";
        font-size: 16px;"
    >
      <h2 style="margin-top: 0, color: white;">
        authorsHAVEN
      </h2>
    </div>
  </div>
    <div
      style="
        font-size: 27px;
        font-weight: bold;
        margin-top: 10.15px;"
    >
      <p
        style="
        display: block;
        font-size: 16px;
        color: #4F4F4F;
        margin-left: 50px;
        "
      >
        Hi ${name},
        </br>
        Please click the button below to ${message}.
      </p>
    </div>

    <div
      style="
        padding-top: 50px;
        text-align: center
      "
    >
        <a
          href="${link}"
          style="
            background-color: #8932b4; 
            border-radius: 5px;
            color: white;
            padding: .5em;
            text-decoration: none;
            "
        >
          Click me 
        </a>
      <p
        style="
        display: block;
        font-size: 16px;
        color: #4F4F4F;
        margin-left: 50px;
        "
      >
        If the button doesn't work, copy and paste this link in your web browser: 
        <br></br>
        ${link}
      </p>
    </div>
  </div>
</div>
`;

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
    html: emailTemplate({ name, link, message })
  };
  return transporter.sendMail(mailOptions);
};

export default sendMail;
