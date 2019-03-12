import bcrypt from 'bcrypt';
import { User } from '../models';

/**
 * Change user password
 */
class ChangePassword {
  /**
   * @description Change user password
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async changePassword(req, res) {
    const passwordResetToken = req.id;
    const { password } = req.body;

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
export default ChangePassword;
