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
    const images = req.images || [];
    const {
      title, description, body, slug
    } = req.body;
    const { id } = req.user;
    const taglist = req.body.taglist ? req.body.taglist.split(',') : [];
    try {
      const userExist = await User.findOne({ where: { id } });
      if (userExist) {
        const result = await Article.create({
          title, description, body, slug, images, taglist
        });
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
