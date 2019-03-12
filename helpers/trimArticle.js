export default (req, res, next) => {
  const { title, description, body } = req.body;
  if (title) req.title = title.trim();
  if (description) req.description = description.trim();
  if (body) req.body = body.trim();
  return next();
};
