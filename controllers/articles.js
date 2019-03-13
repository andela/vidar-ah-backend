import { Op } from 'sequelize';
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
          as: 'author'
        }]
      });
      return res.status(200).json({
        results: results,
        success: true
      });
    } catch (error) {
      return res.status(200).json({
        results: [],
        success: true,
        message: 'Oops, no article with your search terms was found.'
      });
    }
  }

    /**
   * @description - Generate queries for search and filter
   * @static
   * @param {Object}  searchTems - the terms that the user wants to search for
   * @memberof ArticleController
   * @returns {Object} class instance
   */
  static generateSearchQuery(searchTerms) {
    const {
      author, term, endDate, startDate, tags
    } = searchTerms;

    const filterFields = {
      '$user.username$' : {
        $like: author
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
        $contains: tags ? [ ...tags.split(',') ] : []
      }
    }

    !author ? delete filterFields['$user.username$'] : null;
    !startDate || !endDate ? delete filterFields['createdAt'] : null;

    return filterFields;
  }

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
