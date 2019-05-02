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
     * @returns {object} response object
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
      return res.status(500).json({ success: false, errors: [error.message] });
    }
  }

  /**
 * @description - Update a category
 * @static
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @memberof CategoryController
 * @returns {Object} response object
 */
  static async updateCategory(req, res) {
    const { body: { category } } = req;
    const { id } = req;
    try {
      const result = await Category.update(
        {
          categoryName: category
        },
        { where: { id }, returning: true }
      );
      if (result[0]) {
        const { dataValues: { id: returnedId, categoryName } } = result[1][0];
        return res.status(200).json({
          success: true,
          message: 'Category successfully updated',
          categoryName,
          id: returnedId
        });
      }
      if (!result[0]) {
        return res.status(404).json({
          success: false,
          errors: ['No category matches the specified id. Please confirm the category Id and try again.']
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: [error.message] });
    }
  }

  /**
* @description - Delete a category
* @static
* @param {object} req - the request object
* @param {object} res - the response object
* @returns {object} - response object
*/
  static async deleteCategory(req, res) {
    const { params: { id } } = req;
    try {
      await Category.destroy({
        where: {
          id
        },
        returning: true
      });
      return res.status(200).json({
        success: true,
        message: 'Category deleted.',
      });
    } catch (err) {
      return res.status(500).json({ success: false, errors: [err.message] });
    }
  }
}
