'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    ownerId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    notifierId: DataTypes.INTEGER
  }, {});
  notifications.associate = function(models) {
    // associations can be defined here
  };
  return notifications;
};