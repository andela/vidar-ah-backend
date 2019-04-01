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

  req.id = id;
  return next();
};
