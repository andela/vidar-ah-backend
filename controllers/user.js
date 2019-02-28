import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import shortId from 'shortid';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import sendMail from '../helpers/emails';

dotenv.config();
const { JWT_SECRET, HOST_URL } = process.env;
const generateToken = id => jwt.sign(
  { id },
  JWT_SECRET,
  { expiresIn: '24h' }
);

export default class UserController {
  static registerUser(req, res) {
    const { body } = req;
    body.password = bcrypt.hashSync(body.password, 10);
    body.verificationId = shortId.generate();
    User.create(body)
      .then(newUser => {
        const { dataValues: { id, name, verificationId, email } } = newUser;
        const token = generateToken(id);
        const emailPayload = { 
          name,
          email,
          link: `${HOST_URL}/api/v1/verify/${verificationId}`,
        };
        sendMail(emailPayload).then(() => {
          return res.status(201)
            .json({
              success: true,
              message: 'You have signed up successfully.',
              token
            })
        })
    })
    .catch(error => {
      const errors = [];
      if (error.errors[0].path === 'username') {
        errors.push(error.errors[0].message);
      }
      if (error.errors[0].path === 'email') {
        errors.push(error.errors[0].message);
      }
      return res.status(409)
        .json({
          success: false,
          errors
        });
    });
  }

  static verifyAccount(req, res) {
    const { params: { verificationId } } = req;
    User.update({
      verified: true,
    }, {
      where: {
        verificationId,
        verified: false,
      },
    })
      .then(updatedUser => {
        console.log(updatedUser[0])
        if (updatedUser[0] === 0) {
          return res.status(422)
            .json({
              success: false,
              message: 'Error: This user is either verified or not found.'
            });
        };
        return res.status(200)
          .json({
            success: true,
            message: 'Account verified successfully.'
          });
      })
      .catch(error => {
        return res.json({
          success: false,
          message: error.message
        });
      });
  }
}
