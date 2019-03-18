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
      const { dataValues: { categoryName } } = returnValue;
      return res.status(201).json({
        success: true,
        message: 'Category successfully added.',
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
}
