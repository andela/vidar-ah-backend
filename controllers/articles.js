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
    const { title, description, body } = req.body;
    try {
      const result = await Article.create({ title, description, body });
      return res.status(201).json({
        success: true,
        message: 'New article created successfully',
        article: result
      });
    } catch (error) {
      return res.status(409).json({ success: false, error });
    }
  }
}
