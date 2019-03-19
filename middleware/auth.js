import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const response401 = (res, errMsg) => res.status(401).json({ success: false, errors: [errMsg] });
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
        errors: ['Unauthorized! You are required to be logged in to perform this operation.'],
      });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          errors: ['Your session has expired, please login again to continue'],
        });
      }
      req.user = decoded;
      return next();
    });
  }

  /**
    * @description Middleware function to verify if user isLogged in
    * @param {object} req http request object
    * @param {object} res http response object
    * @param {Function} next next middleware function
    * @returns {undefined}
  */
  static isLoggedIn(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token || req.headers.authorization;
    if (!token) {
      return next();
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          errors: ['Your session has expired, please login again to continue'],
        });
      }
      req.user = decoded;
      return next();
    });
  }

  /**
  * @description Middleware function to verify admin
  * @param {object} req http request object
  * @param {object} res http response object
  * @param {Function} next next middleware function
  * @returns {Function} next middleware function
*/
  static authorizeAdmin(req, res, next) {
    const { user: { role } } = req;
    if (role !== 'admin' && role !== 'superadmin') {
      return response401(res, 'Unauthorized! This operation is reserved for Admin or higher.');
    }
    return next();
  }
}

export default Auth;
