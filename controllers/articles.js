import { Article, Ratings } from '../models';

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
      return res.status(500).json({ success: false, errors: [error.message] });
    }
  }

  /**
 * @description - Rate an article
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof ArticleController
 * @returns {Object} class instance
 */
  static async rateArticle(req, res) {
    const { id } = req.user;
    const rating = Number(req.body.rating);
    const { articleId } = req.params;
    try {
      const articleExist = await Article.findOne({ where: { id: articleId } });
      try {
        if (articleExist) {
          if (articleExist.dataValues.userId === id) {
            return res.status(403).json({
              success: false,
              errors: ['Permission denied, user cannot rate their own article']
            });
          }
          const previousRating = await Ratings.findOne({ where: { userId: id, articleId } });
          if (previousRating) {
            const updatedRating = await previousRating.update({ rating });
            return res.status(201).json({
              success: true,
              message: `Article rating has been updated as ${rating}`,
              rating: updatedRating
            });
          }
          return res.status(200).json({
            success: true,
            message: `Article has been rated as ${rating}`,
            articleRating: (await Ratings.create({
              userId: id,
              articleId,
              rating
            }))
          });
        }
      } catch (error) {
        return res.status(400).json({ success: false, errors: ['Error rating this article'] });
      }
    } catch (error) {
      return res.status(404).json({ success: false, errors: ['This article does not exist'] });
    }
  }
}
