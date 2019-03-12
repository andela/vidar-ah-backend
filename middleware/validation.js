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
    .withMessage('Please enter a valid email address')
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
    .withMessage('Username is should be alphamumeric, no special characters and spaces.')
    .isLength({ min: 5, max: 15 })
    .withMessage('Username must be at least 5 characters long and not more than 15.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username.'),
];

export const validateProfileChange = [
  check('firstname')
    .isAlphanumeric()
    .withMessage('Firstname must be alphanumeric characters, please remove leading and trailing whitespaces.'),

  check('lastname')
    .isAlphanumeric()
    .withMessage('Lastname must be alphanumeric characters, please remove leading and trailing whitespaces.'),

  check('bio')
    .isString()
<<<<<<< HEAD
    .withMessage('Bio must be alphanumeric characters, please remove leading and trailing whitespaces.'),
];

export const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email.')
    .custom(value => !/\s/.test(value))
    .withMessage('Please provide a valid email.'),

  check('password')
    .isLength({ min: 6 })
    .withMessage('Please provide a valid password.')
    .custom(value => !/\s/.test(value))
    .withMessage('Please provide a valid password.'),
=======
    .withMessage('Bio must be alphanumeric characters, please remove leading and trailing whitespaces.')
];

export const validateArticle = [
  check('title')
    .exists()
    .withMessage('Article should have a title.')
    .isLength({ min: 6 })
    .withMessage('Title should be at least 6 characters long.'),

  check('description')
    .exists()
    .withMessage('Article should have a description.')
    .isLength({ min: 6 })
    .withMessage('Description should be at least 6 characters long.'),

  check('body')
    .exists()
    .withMessage('Article should have a body.')
    .isLength({ min: 6 })
    .withMessage('Article should have a body with at least 6 characters.'),
>>>>>>> ft-create-user-article-#164139686
];
