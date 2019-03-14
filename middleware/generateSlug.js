import { Article } from '../models';
import generateSlug from '../helpers/slug';

export default async (req, res, next) => {
  const { title } = req.body;
  const slug = generateSlug(req.body.title);
  try {
    const articleExist = await Article.findOne({ where: { slug } });
    req.body.slug = articleExist ? (generateSlug(title)) : slug;
    req.body.slug = slug;
  } catch (error) {
    return res.status(500).json({ success: false, error: [error.message] });
  }
  return next();
};
