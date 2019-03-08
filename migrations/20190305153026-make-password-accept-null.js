module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'Users',
    ['password'],
    {
      type: Sequelize.STRING,
      allowNull: true
    }
  ),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'Users',
    'password'
  )
};
