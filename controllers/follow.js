import { User, follows } from '../models';

/**
 * Controller for follow and unfollow
 */
export default class FollowController {
  /**
   * @description follow a user
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns  {object} response
   */
  static async followUser(req, res) {
    const { userFollowing, userToFollow } = req;

    // Check if user is already following the user and return an error if they are
    const userIsFollowing = await userFollowing.hasFollowing(userToFollow);
    if (userIsFollowing) {
      return res.status(403).json({
        success: false,
        errors: ['You cannot follow a user twice.']
      });
    }

    // Add a new follower
    try {
      await follows.create({
        followingId: userToFollow.id,
        followerId: userFollowing.id
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User followed successfully.'
    });
  }

  /**
   * @description unfollow a user
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns  {object} response
   */
  static async unfollowUser(req, res) {
    const { userFollowing } = req;
    const userToUnfollow = req.userToFollow;

    // Check if user is not following the user and return an error if they aren't
    const userIsFollowing = await userFollowing.hasFollowing(userToUnfollow);

    if (!userIsFollowing) {
      return res.status(403).json({
        success: false,
        errors: ['You cannot unfollow a user you are not following.']
      });
    }

    // unfollow user
    try {
      await userToUnfollow.removeFollower(userFollowing);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User unfollowed successfully.'
    });
  }

  /**
   * @description Get user's followers and followings stats
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async getUserFollowers(req, res) {
    const { id } = req.user;
    const attributes = {
      attributes: ['id', 'email', 'username', 'name', 'image', 'bio']
    };
    try {
      const user = await User.findOne({ where: { id } });
      const userFollowers = await user.getFollowers(attributes);
      return res.status(200).json({
        success: true,
        message: "Successfully gotten user's followers",
        followers: userFollowers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
   * @description Get user's followings stats
   * @param {object} req http request object
   * @param {object} res http response object
   * @returns {object} response
   */
  static async getUserFollowings(req, res) {
    const { id } = req.user;
    const attributes = {
      attributes: ['id', 'email', 'username', 'name', 'image', 'bio']
    };
    try {
      const user = await User.findOne({ where: { id } });
      const userFollowings = await user.getFollowing(attributes);
      return res.status(200).json({
        success: true,
        message: "Successfully gotten user's followings",
        followings: userFollowings
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}
