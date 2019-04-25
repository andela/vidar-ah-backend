import Hooks from '../helpers/notificationHook';

module.exports = (sequelize, DataTypes) => {
  const follows = sequelize.define('follows', {
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {});
  follows.hook('afterCreate', follow => Hooks.handleFollowNotification(sequelize, follow));
  return follows;
};
