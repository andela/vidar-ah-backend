module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'User'
      }
    },
    articleSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Article should have a unique slug'
      }
    },
    likes: {
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Reactions')
};
