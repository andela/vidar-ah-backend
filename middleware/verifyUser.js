import { User } from '../models';

export default (req, res, next) => User.findById(req.user.id, { where: { id: req.user.id } })
  .then(({ dataValues: { verified } }) => {
    if (!verified) {
      return res.status(403).json({
        success: false,
        errors: 'User has not been verified'
      });
    }
    return next();
  });
