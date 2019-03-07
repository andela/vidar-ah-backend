
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    title: {
      type: Sequelize.STRING,
      allowNull: {
        args: true,
        msg: 'Article should have a title'
      }
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Article should have a unique slug'
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: {
        args: true,
        msg: 'Article should have a description'
      }
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: {
        args: true,
        msg: 'Article should have a body'
      }
    },
    taglist: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
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
  down: queryInterface => queryInterface.dropTable('Articles')
};
