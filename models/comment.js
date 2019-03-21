
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'The comment already exists'
      }
    },
    articleSlug: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      onDelete: 'CASCADE',
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Comment.hasMany(models.CommentLikes, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
