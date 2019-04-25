import { User } from '../models';

export default async (req, res, next) => {
  const userToFollowId = req.body.id;
  const { id } = req.user;

  // Return an error if a user tries to follow their account
  if (id === parseInt(userToFollowId, 10)) {
    return res.status(403).json({
      success: false,
      errors: ['You cannot follow or unfollow yourself.']
    });
  }

  const userFollowing = await User.findOne({ where: { id } });
  const userToFollow = await User.findOne({ where: { id: userToFollowId } });

  // Return an error if user tries to follow a non-existing user or an unverified user
  if (!userToFollow || userToFollow.dataValues.verified === false) {
    return res.status(404).json({
      success: false,
      errors: ['User does not exist or is not verified.']
    });
  }
  req.userFollowing = userFollowing;
  req.userToFollow = userToFollow;
  next();
};
