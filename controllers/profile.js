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
        email, username, name, bio, createdAt, updatedAt, interests, image
      } = foundUser;
      const userProfile = {
        id,
        email,
        username,
        name,
        bio,
        interests,
        image,
        createdAt,
        updatedAt
      };

      const splitNamesObject = splitName(foundUser.name);

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
    const {
      bio, firstname, lastname, interests
    } = req.body;
    const name = `${firstname} ${lastname}`;
    try {
      const [, [updatedProfile]] = await User.update({ bio, name, interests }, {
        returning: true,
        raw: true,
        where: { id }
      });
      delete updatedProfile.password;
      delete updatedProfile.verificationId;

      const splitNamesObject = splitName(updatedProfile.name);

      return res.status(202).json({
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

  /**
   * @description - updates user's profile
   * @static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @memberof ProfileController
   * @returns {object} User Profile
   */
  static async updateProfileImage(req, res) {
    const { user: { id }, body: { images } } = req;
    const image = images[0];
    try {
      const [, [{
        name, email, username, bio, image: profilePic, createdAt, updatedAt
      }]] = await User.update({ image }, { returning: true, raw: true, where: { id } });
      return res.status(202).json({
        success: true,
        message: 'Profile image successfully updated',
        result: {
          id, name, username, email, bio, image: profilePic, createdAt, updatedAt
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, errors: ['Error updating profile image'] });
    }
  }
}
