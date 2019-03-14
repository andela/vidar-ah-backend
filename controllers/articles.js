import { Article, User, Category } from '../models';
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
      title, description, body, slug, categoryId
    } = req.body;
    const taglist = req.body.taglist ? req.body.taglist.split(',') : [];
    const { id } = req.user;
    try {
      const result = await Article.create({
        title,
        description,
        body,
        slug,
        images,
        taglist,
        userId: id,
        categoryId: categoryId || 1
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
   * @description - Search for articles
   * @static
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @memberof ArticleController
   * @returns {Object} class instance
   */
  static async searchForArticles(req, res) {
    try {
      const searchTerms = ArticleController.generateSearchQuery(req.query);
      const results = await Article.findAll({
        raw: true,
        where: {
          ...searchTerms,
        },
        include: [{
          model: User,
          attributes: ['username', 'email', 'name', 'bio'],
          as: 'author',
        }, {
          model: Category
        }]
      });
      return res.status(200).json({
        results,
        success: true
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Oops, something went wrong.'
      });
    }
  }

  /**
   * @description - Generate queries for search and filter
   * @static
   * @param {Object}  searchTerms - the terms that the user wants to search for
   * @memberof ArticleController
   * @returns {Object} class instance
   */
  static generateSearchQuery(searchTerms) {
    const {
      author, term, endDate, startDate, tags, categoryId
    } = searchTerms;

    const filterFields = {
      '$author.username$': {
        $like: `%${author}%`
      },
      createdAt: {
        $between: [startDate, endDate]
      },
      title: {
        $like: `%${term}%`,
      },
      description: {
        $like: `%${term}%`,
      },
      taglist: {
        $contains: tags ? [...tags.split(',')] : []
      },
      categoryId: Number(categoryId),
    };

    if (!author) {
      delete filterFields['$author.username$'];
    }
    if (!startDate || !endDate) {
      delete filterFields.createdAt;
    }
    if (!categoryId) {
      delete filterFields.categoryId;
    }
    return filterFields;
  }

  /**
   * @description - Get article by slug
   * @static
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @memberof ArticleController
   * @returns {Object} class instance
   */
  static async getArticleBySlug(req, res) {
    try {
      const {
        params: {
          slug
        }
      } = req;
      const article = await Article.findOne({
        where: {
          slug
        },
        include: [{
          as: 'author',
          model: User,
          attributes: ['username', 'email', 'name', 'bio'],
        }, {
          as: 'author',
          model: Category,
        }]
      });
      return res.status(200).json({
        success: true,
        article: article.dataValues
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        errors: ['Article not found.'],
      });
    }
  }
}
