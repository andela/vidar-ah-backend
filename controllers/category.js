import dotenv from 'dotenv';
import { Category } from '../models';

dotenv.config();

/**
 * @class CategoryController
 *  @override
 * @export
 */
export default class CategoryController {
  /**
     * @description - Creates a new category
     * @static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @memberof CategoryController
     * @returns {object} Class instance
     */
  static async createCategory(req, res) {
    const {
      body: {
        category
      }
    } = req;
    try {
      const returnValue = await Category.create({ categoryName: category.toLowerCase() });
      const { dataValues: { id, categoryName } } = returnValue;
      return res.status(201).json({
        success: true,
        message: 'Category successfully added.',
        id,
        categoryName
      });
    } catch (error) {
      if (error.errors[0].type === 'unique violation') {
        return res.status(409).json({
          success: false,
          errors: [error.errors[0].message]
        });
      }
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  /**
 * @description - Update a category
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof CategoryController
 * @returns {Object} class instance
 */
  static async updateCategory(req, res) {
    const { body: { category } } = req;
    const { id } = req;
    try {
      const result = await Category.update({ categoryName: category }, { where: { id } });
      if (result[0]) {
        return res.status(200).json({
          success: true,
          message: 'Category successfully updated'
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: [error.message] });
    }
  }
}
