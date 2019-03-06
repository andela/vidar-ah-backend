import { User } from '../models';
import generateSlug from '../helpers/slug';

export default async (req, res, next) => {
  const { title } = req.body;
  const slug = generateSlug(req.body.title);
  try {
    const user = await User.findOne({ where: { slug } });
    req.slug = user ? (generateSlug(title)) : slug;
  } catch (error) {
    return res.status(500).json({ success: false, error: [error.message] });
  }
  return next;
};
