import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import shortId from 'shortid';
import sendMail from '../helpers/emails';
import getName from '../helpers/user';
import { User } from '../models';

const { HOST_URL } = process.env;

dotenv.config();
const { JWT_SECRET } = process.env;
const generateToken = (id, expiresIn = '24h') => jwt.sign({ id }, JWT_SECRET, { expiresIn });

/**
 * @class UserController
 *  @override
 * @export
 */
export default class UserController {
  /**
     * @description - Creates a new user
     * @static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @memberof UserController
     * @returns {object} Class instance
     */
  static registerUser(req, res) {
    const {
      body: {
        email, username, password, name
      }
    } = req;
    User.create({
      email,
      username,
      password,
      name
    })
      .then((newUser) => {
        const {
          dataValues: { id }
        } = newUser;
        const token = generateToken(id);
        return res.status(201).json({
          success: true,
          message: 'You have signed up successfully.',
          token
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
        return res.status(409).json({
          success: false,
          errors
        });
      });
  }

  /**
   * @description - login a user
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof UserController
   *
   * @returns {object} Class instance
   */
  static async loginUser(req, res) {
    const {
      body: { rememberMe, password },
      user
    } = req;
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        errors: ['Password is incorrect. * Forgotten your password?']
      });
    }
    const expiresIn = rememberMe ? '240h' : '24h';
    try {
      const token = generateToken(user.id, expiresIn);
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.username}`,
        token
      });
    } catch (err) {
      return res.status(500).json({
        sucess: false,
        errors: [err.message]
      });
    }
  }

  /**
     * @description - Verifies a user's account
     * @static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @memberof UserController
     * @returns {object} Class instance
     */
  static verifyAccount(req, res) {
    const {
      params: { verificationId }
    } = req;
    User.findOne({
      where: { verificationId }
    }).then((foundUser) => {
      if (foundUser) {
        return foundUser
          .verifyAccount()
          .then(() => res.status(200).json({
            success: true,
            message: 'Account verified successfully.'
          }))
          .catch(error => res.json({
            success: false,
            message: [error.message]
          }));
      }
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    });
  }

  /**
   * @description reset user password
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async requestPasswordReset(req, res) {
    const { email } = req.body;
    const passwordResetToken = shortId.generate();
    try {
      // save password reset token to db
      await User.update(
        {
          passwordResetToken,
          passwordResetTokenExpires: Date.now() + (60 * 60 * 1000)
        },
        { where: { email } }
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }

    // get user's name and send reset email
    const name = await getName(email);
    const emailPayload = {
      name,
      email,
      link: `${HOST_URL}/api/v1/resetpassword/${passwordResetToken}`,
      subject: 'Reset your password',
      message: 'reset your password'
    };
    sendMail(emailPayload);

    return res.status(201).json({
      success: true,
      message: 'A link to reset your password has been sent to your mail. Please note that the link is only valid for one hour.'
    });
  }

  /**
   * @description Check if password token in valid
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async resetPassword(req, res) {
    const { params: { passwordResetToken } } = req;
    const { password } = req.body;
    const getPasswordResetToken = await User.findOne({ where: { passwordResetToken } });
    if (!getPasswordResetToken) {
      return res.status(404).json({
        success: false,
        errors: ['Password reset token not found']
      });
    }
    if (getPasswordResetToken.dataValues.passwordResetTokenExpires < Date.now()) {
      return res.status(410).json({
        success: false,
        errors: ['Your link has expired. Please try to reset password again.']
      });
    }
    try {
      // save new password to db and remove password reset token
      await User.update(
        {
          password,
          passwordResetToken: ''
        },
        { where: { passwordResetToken } }
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Password changed successfully.'
    });
  }
}
