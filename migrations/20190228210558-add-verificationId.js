
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'verificationId',
    {
      type: Sequelize.STRING,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'verificationId',
  ),
};
