
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
      await userToFollow.addFollower(userFollowing);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }

    return res.status(200).json({
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
}
