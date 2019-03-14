import ExpressValidator from 'express-validator/check';
import { Article } from '../models';

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
];

export const validateUser = async (req, res, next) => {
  const {
    user,
    params: { id }
  } = req;
  try {
    const article = await Article.findOne({
      where: {
        id
      }
    });
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    const checkUser = article.userId === user.id;
    if (!checkUser) {
      return res.status(401).json({
        success: false,
        error: 'You are unauthorized to perform this action'
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Article does not exist'
    });
  }
};
