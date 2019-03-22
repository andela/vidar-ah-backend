module.exports = (sequelize, DataTypes) => {
  const stats = sequelize.define('stats', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.UUID
  }, {});
  return stats;
};
