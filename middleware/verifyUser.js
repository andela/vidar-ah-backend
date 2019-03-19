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
  User.findOne({ where: { [fieldName]: fieldValue } })
    .then((foundUser) => {
      if (foundUser) {
        const {
          id,
          email,
          username,
          name,
          verified,
          verificationId,
          bio,
          password,
          role
        } = foundUser.dataValues;
        const userObj = {
          id,
          email,
          username,
          name,
          verified,
          verificationId,
          bio,
          password,
          role
        };
        if (!verified) {
          return res.status(403).json({
            success: false,
            errors: [
              'User has not been verified.'
            ]
          });
        }
        req.user = userObj;
        return next();
      }
      return res.status(404).json({
        success: false,
        errors: ['User not found.']
      });
    });
};
