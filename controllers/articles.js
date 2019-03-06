import { Article, User } from '../models';

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
    const { id } = req.user;
    try {
      const user = await User.findOne(id, { where: { id } });
      if (user) {
        const result = await Article.create({ title, description, body });
        return res.status(201).json({
          success: true,
          message: 'New article created successfully',
          article: result,
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ success: false, error: [error.message] });
    }
  }
}
