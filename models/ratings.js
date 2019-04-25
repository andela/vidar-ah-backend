import Hooks from '../helpers/notificationHook';

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

  Ratings.hook('afterUpdate', ratings => Hooks.handleRatingsNotification(sequelize, ratings));
  return Ratings;
};
