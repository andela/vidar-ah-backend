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
    .withMessage('Bio must be alphanumeric characters, please remove leading and trailing whitespaces.'),
];

export const validateEmail = [
  check('email')
    .isEmail()
    .withMessage('Email is invalid.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the email.')
];

export const validatePassword = [
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password.')
];
