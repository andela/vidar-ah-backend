import { CommentLikes } from '../models';

/**
 * @description This function checks if a comment has been liked by a user
 * @param {string} commentId Comment ID
 * @param {string} userId User id
 * @returns {boolean} if comment has been liked
 */
const isCommentLikedByUser = async (commentId, userId) => {
  const findComment = await CommentLikes.findOne({
    where: {
      userId, commentId
    }
  });
  if (findComment) { return true; }
  return false;
};

export default isCommentLikedByUser;
