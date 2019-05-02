import sendNotification from './sendNotification';

/**
 * A class to contain all the hooks that handle notification
 */
class Hooks {
  /**
   * handleFollowNotification() will handle the notifcaiton after
   *  a follow action is saved in the follow table
   * @param {object} sequelize - the sequelize object
   * @param {object} follow - the follow object which contains both the follower and the followed
   * @returns {undefined} undefined
   */
  static async handleFollowNotification(sequelize, follow) {
    const { followingId: theFollowedId, followerId: theFollowerId } = follow;
    const [theFollowed, theFollower] = await sequelize.models.User.findAll({
      where: { id: [theFollowedId, theFollowerId] }
    });
    const {
      id: userId, email, name, notificationChoice: choice
    } = theFollowed;
    const { username } = theFollower;
    const message = `${username} followed you`;
    const notificationData = {
      userId,
      email,
      name,
      choice,
      message
    };
    if (notificationData.choice !== 'none') {
      await sequelize.models.notification.create({ ...notificationData });
      await sendNotification({ ...notificationData });
    }
  }

  /**
   * handleNewCommentNotification() handles user notification
   * after a new commnent is created
   * @param {object} sequelize - the sequelize object
   * @param {object} comment - the comment left by the reader
   * @returns {undefined} undefined
   */
  static async handleNewCommentNotification(sequelize, comment) {
    const { articleSlug: slug, userId: readerId } = comment;
    const [article] = await sequelize.models.Article.findAll({
      raw: true,
      where: {
        slug
      },
      include: [
        {
          model: sequelize.models.User,
          attributes: ['id', 'name', 'email', 'notificationChoice'],
          as: 'author'
        }
      ]
    });
    const { username: readerUsername } = await sequelize.models.User.findOne({
      where: {
        id: readerId
      }
    });
    const notificationData = {
      userId: article['author.id'],
      email: article['author.email'],
      name: article['author.name'],
      choice: article['author.notificationChoice'],
      message: `${readerUsername} left a comment on ${article.title}`,
      url: `/${slug}`,
    };
    if (notificationData.choice !== 'none') {
      await sequelize.models.notification.create({ ...notificationData });
      await sendNotification({ ...notificationData });
    }
  }

  /**
   * handleRatingsNotification() handles user notification
   * after a new commnent is created
   * @param {object} sequelize - the sequelize object
   * @param {object} ratings - the ratings objects
   * @returns {undefined} undefined
   */
  static async handleRatingsNotification(sequelize, ratings) {
    const { articleId, userId: readerId, rating } = ratings;
    const [article] = await sequelize.models.Article.findAll({
      raw: true,
      where: {
        id: articleId
      },
      include: [
        {
          model: sequelize.models.User,
          attributes: ['id', 'name', 'email', 'notificationChoice'],
          as: 'author'
        }
      ]
    });
    const { username: readerUsername } = await sequelize.models.User.findOne({
      where: {
        id: readerId
      }
    });
    const notificationData = {
      userId: article['author.id'],
      email: article['author.email'],
      name: article['author.name'],
      choice: article['author.notificationChoice'],
      message: `${readerUsername} has a new rating of ${rating} for "${article.title}"`,
      url: `/${articleId}`,
    };
    if (notificationData.choice !== 'none') {
      await sequelize.models.notification.create({ ...notificationData });
      await sendNotification({ ...notificationData });
    }
  }

  /**
   * handleLikeNotification() handles user notification
   * after a new commnent is created
   * @param {object} sequelize - the sequelize object
   * @param {object} reaction - the return value after a like reaction is created
   * @returns {undefined} undefined
   */
  static async handleLikeNotification(sequelize, reaction) {
    const { articleSlug: slug, userId: readerId } = reaction;
    const [article] = await sequelize.models.Article.findAll({
      raw: true,
      where: {
        slug
      },
      include: [
        {
          model: sequelize.models.User,
          attributes: ['id', 'name', 'email', 'notificationChoice'],
          as: 'author'
        }
      ]
    });
    const { username: readerUsername } = await sequelize.models.User.findOne({
      where: {
        id: readerId
      }
    });
    const notificationData = {
      userId: article['author.id'],
      email: article['author.email'],
      name: article['author.name'],
      choice: article['author.notificationChoice'],
      message: `${readerUsername} liked ${article.title}`,
      url: `/${slug}`,
    };
    if (notificationData.choice !== 'none') {
      await sequelize.models.notification.create({ ...notificationData });
      await sendNotification({ ...notificationData });
    }
  }
}

export default Hooks;
