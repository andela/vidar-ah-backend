export default (sequelize, DataTypes) => {
  const Ratings = sequelize.define('Ratings', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.UUID,
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  Ratings.associate = (models) => {
    Ratings.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
  };
  return Ratings;
};
