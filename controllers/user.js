import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models';
// import sendMail from '../helpers/emails';

dotenv.config();
const { JWT_SECRET } = process.env;
const generateToken = id => jwt.sign(
  { id },
  JWT_SECRET,
  { expiresIn: '24h' },
);


/**
 * @class UserController
 *  @override
 * @export
 *
 */
export default class UserController {
  /**
     * @description - Creates a new user
     * @static
     *
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     *
     * @memberof UserController
     *
     * @returns {object} Class instance
     */
  static registerUser(req, res) {
    const { body } = req;
    User.create(body)
      .then((newUser) => {
        const {
          dataValues: {
            id,
          },
        } = newUser;
        const token = generateToken(id);
        return res.status(201)
          .json({
            success: true,
            message: 'You have signed up successfully.',
            token,
          });
      })
      .catch((error) => {
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
            errors,
          });
      });
  }

  /**
     * @description - Verifies a user's account
     * @static
     *
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     *
     * @memberof UserController
     *
     * @returns {object} Class instance
     */
  static verifyAccount(req, res) {
    const { params: { verificationId } } = req;
    User.findOne({
      where: { verificationId },
    })
      .then((foundUser) => {
        if (foundUser) {
          return foundUser.verifyAccount()
            .then(() => res.status(200)
              .json({
                success: true,
                message: 'Account verified successfully.',
              }))
            .catch(error => res.json({
              success: false,
              message: error.message,
            }));
        }
        return res.json({
          success: false,
          message: 'User not found',
        });
      });
  }

}
