import { User } from '../models';

export default (req, res, next) => {
  const { body, user } = req;
  const options = {};
  if (user) {
    options.fieldName = 'id';
    options.fieldValue = user.id;
  } else if (body) {
    options.fieldName = 'email';
    options.fieldValue = body.email;
  }

  const { fieldName, fieldValue } = options;
  User.findOne({ where: { [fieldName]: fieldValue } }).then((foundUser) => {
    if (foundUser) {
      const {
        dataValues: { verified }
      } = foundUser;
      if (!verified) {
        return res.status(403).json({
          success: false,
          errors: ['User has not been verified.']
        });
      }
      req.user = foundUser.dataValues;
      return next();
    }
    return res.status(404).json({
      success: false,
      errors: ['User not found.']
    });
  });
};
