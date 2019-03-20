import { Article } from '../models';

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
}
