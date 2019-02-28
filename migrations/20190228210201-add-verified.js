
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'verified',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'verified',
  ),
};
