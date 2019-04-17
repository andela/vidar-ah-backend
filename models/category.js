module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The specified category already exists'
      }
    }
  }, {});
  Category.associate = (models) => {
    Category.hasMany(models.Article, {
      foreignKey: 'id'
    });
  };
  return Category;
};
