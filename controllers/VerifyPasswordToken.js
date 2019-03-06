import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models';

dotenv.config();
const { JWT_SECRET } = process.env;

/**
 * Verify password token
 */
class VerifyPasswordToken {
  /**
   * @description Check if password token in valid
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async checkPasswordToken(req, res) {
    const { params: { passwordResetToken } } = req;
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

    const token = jwt.sign(
      { id: passwordResetToken },
      JWT_SECRET,
      { expiresIn: '1h' },
    );
    return res.status(200).json({
      success: true,
      message: 'You can now reset your password.',
      token
    });
  }
}
export default VerifyPasswordToken;
