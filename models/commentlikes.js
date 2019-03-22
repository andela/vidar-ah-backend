module.exports = (sequelize, DataTypes) => {
  const CommentLikes = sequelize.define('CommentLikes', {
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  CommentLikes.associate = (models) => {
    CommentLikes.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    CommentLikes.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return CommentLikes;
};
