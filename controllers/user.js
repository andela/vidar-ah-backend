import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { User } from '../models';

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
  static async loginUser(req, res) {
    const { email, password, rememberMe } = req.body;
    try {
      const foundUser = await User.findOne({
        where: { email }
      });
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          errors: ['Invalid credentials'],
        });
      }
      const passwordMatch = compareSync(password, foundUser.password);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          errors: ['Password is incorrect. * Forgotten your password?'],
        });
      }
      const expiresIn = rememberMe ? '240h' : '24h';
      try {
        const token = generateToken(foundUser.id, expiresIn);
        return res.status(200).json({
          success: true,
          message: `Welcome ${foundUser.username}`,
          token
        });
      } catch (err) {
        return res.status(500).json({
          sucess: false,
          errors: [err.message]
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
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
      return res.json({
        success: false,
        message: 'User not found'
      });
    });
  }
}
