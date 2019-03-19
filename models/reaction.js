module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Article should have a unique slug'
      }
    },
    likes: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  Reaction.associate = (models) => {
    Reaction.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      as: 'article',
      onDelete: 'CASCADE',
      sourceKey: 'slug'
    });
    Reaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Reaction;
};