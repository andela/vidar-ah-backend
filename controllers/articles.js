import { Article, Reaction } from '../models';

/**
 * @class ArticleController
 * @override
 * @export
 */
export default class ArticleController {
/**
 * @description - Create a new article
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async createArticle(req, res) {
    const images = req.images || [];
    const {
      title, description, body, slug
    } = req.body;
    const taglist = req.body.taglist ? req.body.taglist.split(',') : [];
    const { id } = req.user;
    try {
      const result = await Article.create({
        title, description, body, slug, images, taglist, userId: id
      });
      return res.status(201).json({
        success: true,
        message: 'New article created successfully',
        article: result,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: [error.message] });
    }
  }

  /**
 * @description - Update an article
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async updateArticle(req, res) {
    const images = req.images || [];
    const {
      title, description, body
    } = req.body;

    const {
      params: { slug }
    } = req;
    try {
      const result = await Article.update({
        title,
        description,
        body,
        images
      }, {
        where: {
          slug
        }
      });
      return res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        article: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
 * @description - Deletes an article
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async deleteArticle(req, res) {
    try {
      await Article.destroy({
        where: {
          slug: req.params.slug
        }
      });
      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }

  /**
   * @desc check if a user likes an article
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @memberof ArticleController
   * @return {Object} returns an object
   */
  static async likeArticle(req, res) {
    const { id: userId } = req.user;
    const { slug: articleSlug } = req.params;

    try {
      // const likes = await Reaction.findAndCountAll({
      //   where: {
      //     like: true
      //   },
      //   include: [{
      //     model: User,
      //     as: 'user',
      //     attributes: ['username', 'bio', 'name']
      //   }, {
      //     model: Article,
      //     as: 'article',
      //     attributes: ['articleSlug']
      //   }]
      // });
      const likeArticle = await Reaction.findOne({
        where: {
          articleSlug,
          userId
        }
      });
      if (!likeArticle) {
        await Reaction.create({
          articleSlug,
          userId,
          like: true,
        });
        return res.status(201).json({
          success: true,
          message: 'Article liked successfully',
          // like: likes.count
        });
      } if (
        (likeArticle)
        && (likeArticle.like === true)) {
        await Reaction.destroy({
          where: {
            articleSlug,
            userId,
          }
        });
        return res.status(200).json({
          success: true,
          message: 'You have unliked this article'
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
   * @desc check if a user dislikes an article
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @memberof ArticleController
   * @return {Object} returns an object
   */
  static async dislikeArticle(req, res) {
    const { id: userId } = req.user;
    const { slug: articleSlug } = req.params;

    try {
      const likeArticle = await Reaction.findOne({
        where: {
          articleSlug,
          userId
        }
      });
      if (!likeArticle) {
        await Reaction.create({
          articleSlug,
          userId,
          like: false
        });
        return res.status(201).json({
          success: true,
          message: 'Article disliked successfully'
        });
      } if (
        (likeArticle)
        && (likeArticle.like === false)) {
        await Reaction.destroy({
          where: {
            articleSlug,
            userId,
          }
        });
        return res.status(200).json({
          success: true,
          message: 'You have removed the dislike on this article'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}
