import shortId from 'shortid';
import { User } from '../models';
import getName from '../helpers/user';
import sendMail from '../helpers/emails';

const { HOST_URL } = process.env;

/**
 * Password reset class
 */
class PasswordReset {
  /**
   * @description reset user password
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async resetPassword(req, res) {
    const { email } = req.body;
    const passwordResetToken = shortId.generate();
    try {
      // save password reset token to db
      await User.update(
        { passwordResetToken },
        { where: { email } }
      );

      // save token expiration date (1 hr) to db
      await User.update(
        { passwordResetTokenExpires: Date.now() + (60 * 60 * 1000) },
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
      link: `${HOST_URL}/api/v1/verifypasswordkey/${passwordResetToken}`,
      subject: 'Reset your password',
      message: 'reset your password'
    };
    sendMail(emailPayload);

    return res.status(201).json({
      success: true,
      message: 'A link to reset your password has been sent to your mail. Please note that the link is only valid for one hour.'
    });
  }
}
export default PasswordReset;
