import _ from 'underscore';
import { User } from '../models';
import splitName from '../helpers/splitName';

/**
 * @class ProfileController
 *  @override
 * @export
 *
 */
export default class ProfileController {
  /**
   * @description - Renders a user's profile
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProfileController
   *
   * @returns {object} User Profile
   */
  static async viewProfile(req, res) {
    const { id } = req.user;

    try {
      const foundUser = await User.findOne({
        raw: true,
        where: {
          id
        }
      });

      const {
        email, username, name, bio, createdAt, updatedAt
      } = foundUser;
      const userProfile = {
        id,
        email,
        username,
        name,
        bio,
        createdAt,
        updatedAt
      };

      const splitNamesObject = splitName(foundUser);

      return res.status(200).json({
        success: true,
        body: _.extendOwn(userProfile, splitNamesObject)
      });
    } catch (error) {
      return res.status(409).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
   * @description - updates user's profile
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProfileController
   *
   * @returns {object} User Profile
   */
  static async editProfile(req, res) {
    const { id } = req.user;
    const { bio, firstname, lastname } = req.body;

    try {
      const updateResult = await User.update(
        { bio, name: `${firstname} ${lastname}` },
        {
          returning: true,
          raw: true,
          where: {
            id
          }
        }
      );

      const updatedProfile = updateResult[1][0];

      delete updatedProfile.password;
      delete updatedProfile.verificationId;

      const splitNamesObject = splitName(updatedProfile);

      return res.status(205).json({
        success: true,
        body: _.extendOwn(updatedProfile, splitNamesObject)
      });
    } catch (error) {
      return res.status(409).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}
