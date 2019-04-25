module.exports = (sequelize, DataTypes) => {
  const reports = sequelize.define('reports', {
    articleSlug: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  reports.associate = (models) => {
    reports.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      onDelete: 'CASCADE',
      as: 'article',
      targetKey: 'slug'
    });
    reports.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user'
    });
  };
  return reports;
};
