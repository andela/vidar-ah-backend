
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: {
        args: true,
        msg: 'Article should have a title'
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Article should have a unique slug'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: {
        args: true,
        msg: 'Article should have a description'
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: {
        args: true,
        msg: 'Article should have a body'
      }
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    taglist: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    }
  }, {});

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'author'
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Article.hasMany(models.Reaction, {
      foreignKey: 'articleSlug',
      as: 'articleReactions',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Ratings, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      sourceKey: 'id'
    });
    Article.belongsToMany(models.User, {
      foreignKey: 'articleId',
      as: 'viewers',
      through: models.stats
    });
    Article.hasMany(models.reports, {
      foreignKey: 'articleSlug',
      sourceKey: 'slug',
    });
  };
  return Article;
};
