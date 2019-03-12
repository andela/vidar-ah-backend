import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;
require('dotenv').config();
/**
 * Authentication class
 */
class Auth {
  /**
   * @description Middleware function to verify if user has a valid token
   * @param {object} req http request object
   * @param {object} res http response object
   * @param {Function} next next middleware function
   * @returns {undefined}
   */
  static verifyUser(req, res, next) {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided.',
=======

const { JWT_SECRET } = process.env;
/**
* Authentication class
*/
class Auth {
/**
  * @description Middleware function to verify if user has a valid token
  * @param {object} req http request object
  * @param {object} res http response object
  * @param {Function} next next middleware function
  * @returns {undefined}
*/
  static verifyUser(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! You are required to be logged in to perform this operation.',
>>>>>>> ft-create-user-article-#164139686
      });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
<<<<<<< HEAD
          body: err,
          message: 'Failed to authenticate token.',
        });
      }
      req.user = decoded;
      next();
    });
  }
}
=======
          message: 'Your session has expired, please login again to continue',
        });
      }
      req.user = decoded;
      return next();
    });
  }
}

>>>>>>> ft-create-user-article-#164139686
export default Auth;
