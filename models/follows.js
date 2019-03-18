module.exports = (sequelize, DataTypes) => {
  const follows = sequelize.define('follows', {
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {});
  return follows;
};
