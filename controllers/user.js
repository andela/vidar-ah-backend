/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import shortId from 'shortid';
import sendMail from '../helpers/emails';
import getName from '../helpers/user';
import { User, Article } from '../models';

dotenv.config();

const { HOST_URL_FRONTEND, JWT_SECRET } = process.env;

const generateToken = (id, role, expiresIn = '24h') => jwt.sign({ id, role }, JWT_SECRET, { expiresIn });

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
        email, username, password, name, interests
      }
    } = req;
    User.create({
      email,
      username,
      password,
      name,
      interests
    })
      .then((newUser) => {
        const {
          dataValues: { id, role }
        } = newUser;
        const token = generateToken(id, role);
        return res.status(201).json({
          success: true,
          message: 'You have signed up successfully.',
          user: {
            name, username, email, role, id
          },
          token
        });
      })
      .catch((error) => {
        const errors = [];
        if (error.errors && error.errors[0].path === 'username') {
          errors.push(error.errors[0].message);
        }
        if (error.errors && error.errors[0].path === 'email') {
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
      const {
        username, email, name, role, id
      } = user;
      const token = generateToken(user.id, role, expiresIn);
      return res.status(200).json({
        success: true,
        message: `Welcome ${username}`,
        user: {
          username,
          email,
          name,
          role,
          id
        },
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
      params: { verification_id }
    } = req;
    User.findOne({
      where: { verificationId: verification_id }
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
        errors: ['User not found.']
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
      link: `${HOST_URL_FRONTEND}/resetpassword/${passwordResetToken}`,
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
    const { params: { password_reset_token } } = req;
    const { password } = req.body;
    const getPasswordResetToken = await User.findOne(
      { where: { passwordResetToken: password_reset_token } }
    );
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
          password_reset_token: ''
        },
        { where: { passwordResetToken: password_reset_token } }
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

  /**
 * @description Get user reading stats
 * @param {object} req http request object
 * @param {object} res http response object
 * @returns {object} response
 */
  static async getReadingStats(req, res) {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    try {
      const viewCount = await user.getView();
      return res.status(200).json({
        success: true,
        numberOfArticlesRead: viewCount.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
   * @description Get user's article count
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async getUserArticlesCount(req, res) {
    const { id: userId } = req.user;
    try {
      const { count } = await Article.findAndCountAll({ where: { userId } });
      return res.status(200).json({
        success: true,
        articleCount: count
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}
