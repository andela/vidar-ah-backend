import ExpressValidator from 'express-validator/check';

const { check, validationResult } = ExpressValidator;

export const returnValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
    .array()
    .map(error => error.msg);
  if (!errors.length) return next();
  return res.status(422).json({ errors, success: false });
};

export const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the email.'),

  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password.'),

  check('name')
    .isString()
    .withMessage('Name must be alphanumeric characters.'),

  check('username')
    .isAlphanumeric()
    .withMessage('Username is invalid.')
    .isLength({ min: 5, max: 15 })
    .withMessage('Username must be at least 5 characters long and not more than 15.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username.'),
];

export const validateArticle = [
  check('title')
    .exists()
    .withMessage('Article should have a title.'),

  check('description')
    .exists()
    .withMessage('Article should have a description.')
    .isLength({ min: 6 })
    .withMessage('Description must be at least 6 characters long.'),

  check('body')
    .exists()
    .withMessage('Article should have a body.')
    .isLength({ min: 6 })
    .withMessage('Article should have a body with at least 6 characters long.'),
];
