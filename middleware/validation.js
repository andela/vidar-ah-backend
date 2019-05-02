import ExpressValidator from 'express-validator/check';
import { Article, Comment } from '../models';

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

export const validateArticleAuthor = async (req, res, next) => {
  const {
    user,
    params: { slug }
  } = req;
  try {
    const article = await Article.findOne({
      where: {
        slug
      }
    });
    if (!article) {
      return res.status(404).json({
        success: false,
        errors: ['Article not found']
      });
    }
    if (!(article.userId === user.id)) {
      return res.status(403).json({
        success: false,
        errors: ['You are unauthorized to perform this action']
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: ['Article does not exist']
    });
  }
};

export const validateCategory = [
  check('category')
    .exists()
    .withMessage('No category provided. Please provide a category.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Category must be at least 3 characters long and no more than 30.')
    .isString()
    .withMessage('Category must be alphanumeric characters, please remove leading and trailing whitespaces.')
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

export const checkIfArticleExists = async (req, res, next) => {
  const slug = (req.params.slug) ? req.params.slug : req.body.slug;
  try {
    const article = await Article.findOne({
      where: {
        slug
      }
    });
    if (!article) {
      return res.status(404).json({
        success: false,
        errors: ['Article not found']
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [error.message]
    });
  }
};

export const validateSearch = [
  check('term')
    .isString()
    .withMessage('Please provide a valid search term.')
];

export const validateCreateComment = [
  check('comment')
    .exists()
    .withMessage('Please include a comment in the body of request.')
    .isString()
    .trim()
    .withMessage('Comment must be alphanumeric characters, please remove leading and trailing whitespaces.')
    .isLength({ min: 2 })
    .withMessage('Comments should be at least 2 characters long.'),
];

export const validateEditComment = [
  check('id')
    .exists()
    .withMessage('Please supply ID of comment to be edited')
    .isNumeric()
    .withMessage('Comment ID must be an integer.'),

  check('comment')
    .exists()
    .withMessage('Please include new comment in the body of request.')
    .isString()
    .trim()
    .withMessage('Comment must be alphanumeric characters, please remove leading and trailing whitespaces.')
    .isLength({ min: 2 })
    .withMessage('Comments should be at least 2 characters long.'),
];

export const validateCommentUser = async (req, res, next) => {
  const {
    user,
    params: { id }
  } = req;
  try {
    const comment = await Comment.findOne({
      where: {
        id
      }
    });
    if (!comment) {
      return res.status(404).json({
        success: false,
        errors: ['Comment not found.']
      });
    }
    const checkUser = comment.userId === user.id;
    if (!checkUser) {
      return res.status(401).json({
        success: false,
        errors: ['You are unauthorized to perform this action']
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: ['Article does not exist']
    });
  }
};
export const validateCommentExist = async (req, res, next) => {
  const {
    params: { id }
  } = req;
  try {
    const comment = await Comment.findOne({
      where: {
        id
      }
    });
    if (!comment) {
      return res.status(404).json({
        success: false,
        errors: ['Comment not found.']
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: [error.message]
    });
  }
};

export const validateArticleExist = async (req, res, next) => {
  const { slug } = req.params || req.body;
  try {
    const article = await Article.findOne({ where: { slug } });

    if (!article) {
      return res.status(404).json({
        success: false,
        errors: ['Article not found']
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: ['Article does not exist/Invalid UUID'] });
  }
  return next();
};

export const validateArticleRating = [
  check('rating')
    .exists()
    .withMessage('Please provide a rating for this article.')
    .custom(value => `${Number(value)}` !== 'NaN')
    .withMessage('Rating should be a number.')
    .custom(value => [1, 2, 3, 4, 5].indexOf(Number(value)) !== -1)
    .withMessage('Ratings should have values ranging from 1 to 5.')
];

export const validateArticleId = [
  check('articleId')
    .isUUID()
    .withMessage('Please provide a valid id for the article')
];

export const validateGetOrder = [
  check('type')
    .exists()
    .withMessage('Please provide a type of order to get.')
    .custom(value => ['latest', 'ratings', 'comments'].indexOf(value) !== -1)
    .withMessage('Order type should either be latest, ratings or comments')
];

export const validateImages = [
  check('images')
    .exists()
    .withMessage('An image file should be uploaded to complete this request')
];

export const validateReport = [
  check('type')
    .exists()
    .withMessage('Please specify a report type.'),
  check('slug')
    .exists()
    .withMessage('Slug is required.')
];

export const validateInterest = (req, res, next) => {
  const { body: { interests } } = req;
  if (interests) {
    req.body.interests = interests
      .split(',')
      .map(interest => interest.replace(/(\[|\])/, '').trim().toLowerCase());
  }
  return next();
};

export const validateNotificationChoice = async (req, res, next) => {
  let { notificationChoice } = req.body;

  if (!notificationChoice) {
    return res.status(400).json({
      success: false,
      errors: [
        'Please provide a valid notificationChoice, e.g notificationChoice: email only'
      ]
    });
  }
  switch (notificationChoice.toLowerCase()) {
    case 'email only':
      notificationChoice = 'emailOnly';
      break;
    case 'app only':
      notificationChoice = 'appOnly';
      break;
    case 'both':
      break;
    case 'none':
      break;
    default:
      return res.status(400).json({
        success: false,
        errors: [
          'Invalid notification choice, allowed values are email only, app only, both, or none'
        ]
      });
  }
  req.notificationChoice = notificationChoice;
  return next();
};
