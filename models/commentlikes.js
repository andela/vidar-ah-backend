module.exports = (sequelize, DataTypes) => {
  const commentLikes = sequelize.define('commentLikes', {
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  return commentLikes;
};
