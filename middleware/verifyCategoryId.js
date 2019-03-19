import { Category } from '../models';

export default async (req, res, next) => {
  const { params: { id } } = req;

  if (Number.isNaN(Number(id))
|| !Number.isInteger(Number(id))
|| Number(id) < 0) {
    return res.status(400).json({
      success: false,
      errors: ['Invalid category id.']
    });
  }

  const category = await Category.findOne({ where: { id } });
  if (!category) {
    return res.status(404).json({
      success: false,
      errors: ['No category matches the specified id. Please confirm the category Id and try again.']
    });
  }

  req.id = id;
  return next();
};
