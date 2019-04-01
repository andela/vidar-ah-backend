
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists.',
      },
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exists.',
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    role: {
      type: Sequelize.ENUM,
      values: ['superadmin', 'admin', 'user'],
      allowNull: false,
      defaultValue: 'user',
      unique: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users'),
};
