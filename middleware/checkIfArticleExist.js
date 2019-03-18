
import { Article } from '../models';

export default async (req, res, next) => {
  const { id } = req.user;
  const { articleId } = req.params;
  try {
    const articleExist = await Article.findOne({ where: { id: articleId } });
    if (articleExist) {
      if (articleExist.dataValues.userId === id) {
        return res.status(403).json({
          success: false,
          errors: ['Permission denied, user cannot rate their own article']
        });
      } return next();
    }
    return res.status(404).json({
      success: false,
      errors: ['This article does not exist']
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: ['Error rating article']
    });
  }
};
