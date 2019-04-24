import { reports, Article, User } from '../models';


/**
 * @class ReportsController
 *  @override
 * @export
 *
 */
export default class ReportsController {
  /**
   * @description - reports an article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ReportsController
   *
   * @returns {object} response
   */
  static async reportAnArticle(req, res) {
    const {
      body: { type, message },
      params: { slug },
      user: { id }
    } = req;
    await reports.create({
      articleSlug: slug, type, message, userId: id
    });
    return res
      .status(200).json({
        success: true,
        message: 'Article reported successfully.'
      });
  }

  /**
   * @description - gets all reports
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ReportsController
   *
   * @returns {object} response
   */
  static async getAllReports(req, res) {
    const allReports = await reports.findAll({
      where: {},
      include: [{
        model: Article,
        as: 'article'
      }, {
        model: User,
        as: 'user',
        attributes: ['email', 'username', 'name', 'image']
      }]
    });

    return res.status(200)
      .json({
        reports: allReports,
        success: true
      });
  }
}
