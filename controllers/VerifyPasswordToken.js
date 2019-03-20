import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models';

dotenv.config();

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
      // save new password to db
      await User.update(
        { password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) },
        { where: { passwordResetToken } }
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }

    try {
      // delete password token
      await User.update(
        { passwordResetToken: '' },
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
export default VerifyPasswordToken;
