import { Article, Category, User } from '../models';

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
 * @description - Get all articles
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async getAllArticles(req, res) {
    try {
      const {
        query: {
          offset, limit
        }
      } = req;

      const articles = await Article.findAll({
        where: {},
        offset: Number(offset) || 0,
        limit: Number(limit) || 10,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['username', 'bio', 'name']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['categoryName']
          }
        ]
      });

      return res.status(200).json({
        success: true,
        articles
      });
    } catch (error) {
      return res.status(500).json({
        succes: false,
        errors: ['Oops, something wrong occured.']
      });
    }
  }

  /**
 * @description - Get a specific number of articles with criteria
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async getArticlesByHighestField(req, res) {
    try {
      const {
        query: {
          amount, type
        }
      } = req;
      let order;
      if (type === 'latest') {
        order = [['updatedAt', 'ASC']];
      }
      const articles = await Article.findAll({
        where: {},
        limit: Number(amount) || 5,
        order
      });
      return res.status(200).json({
        success: true,
        articles
      });
    } catch (error) {
      return res.status(500).json({
        succes: false,
        errors: ['Oops, something wrong occured.']
      });
    }
  }
}
