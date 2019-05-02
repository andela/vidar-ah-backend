import Sequelize from 'sequelize';
import { Comment, User, commentLikes } from '../models';


/**
 * @class CommentController
 *  @override
 * @export
 *
 */
export default class CommentController {
  /**
   * @description - Creates an article comment
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CommentController
   *
   * @returns {object} Article comment
   */
  static async createComment(req, res) {
    const { id } = req.user;
    const { slug: articleSlug } = req.params;
    const { comment } = req.body;
    try {
      const newComment = await Comment.create({
        userId: id, articleSlug, comment
      });

      return res.status(205).json({
        success: true,
        message: 'New article comment created successfully',
        comment: newComment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
   * @description - Gets an article's comments
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CommentController
   *
   * @returns {object} Article comment
   */
  static async getComments(req, res) {
    const { slug: articleSlug } = req.params;
    try {
      const findComment = await Comment.findAll({
        raw: true,
        where: {
          articleSlug
        },
        group: ['User.username', 'User.bio', 'User.email', 'Comment.id'],
        include: [
          {
            model: User,
            attributes: ['username', 'bio', 'email']
          },
          {
            as: 'likes',
            model: commentLikes,
            attributes: [
              [
                Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'commentCount'
              ]
            ]
          }
        ]
      });
      return res.status(205).json({
        success: true,
        message: 'Comments returned successfully',
        comments: findComment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
 * @description - Edit an article comment
 * @static
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 *
 * @memberof CommentController
 *
 * @returns {object} Updated article comment
 */
  static async editComment(req, res) {
    const { id } = req.params;
    const { comment } = req.body;
    try {
      const updatedComment = await Comment.update(
        {
          comment
        },
        {
          returning: true,
          raw: true,
          where: {
            id
          }
        }
      );
      const newComment = updatedComment[1][0];

      return res.status(205).json({
        success: true,
        message: 'Comment updated successfully',
        body: newComment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
* @description - Delete an article comment
* @static
*
* @param {object} req - HTTP Request
* @param {object} res - HTTP Response
*
* @memberof CommentController
*
* @returns {string} Comment delete status
*/
  static async deleteComment(req, res) {
    const { id } = req.params;
    try {
      const rowsDeleted = await Comment.destroy({
        where: {
          id
        }
      });
      if (rowsDeleted === 1) {
        return res.status(205).json({
          success: true,
          message: 'Comment deleted successfully',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
* @description - Like/unlike an article comment
* @static
*
* @param {object} req - HTTP Request
* @param {object} res - HTTP Response
*
* @memberof CommentController
*
* @returns {string} Like/unlike comment result
*/
  static async likeComment(req, res) {
    const { id } = req.params;
    const { id: userId } = req.user;
    const currentUser = await User.findOne({ where: { id: userId } });
    const currentComment = await Comment.findOne({ where: { id } });
    const userHasLiked = await currentUser.hasCommentLiked(currentComment.id);
    try {
      if (userHasLiked) {
        await commentLikes.destroy({
          where: {
            userId, commentId: id
          }
        });
        return res.status(201).json({
          success: true,
          message: 'Comment unliked successfully',
          comment: currentComment
        });
      }
      await currentUser.addCommentLiked(currentComment.id);
      return res.status(201).json({
        success: true,
        message: 'Comment liked successfully',
        comment: currentComment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}
