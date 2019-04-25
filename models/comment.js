
import Hooks from '../helpers/notificationHook';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    articleSlug: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Comment.hasMany(models.commentLikes, {
      as: 'likes',
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comment.belongsToMany(models.User, { as: 'commentLiker', through: models.commentLikes, foreignKey: 'commentId' });
  };

  Comment.hook('afterCreate', comment => Hooks.handleNewCommentNotification(sequelize, comment));
  return Comment;
};
