
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'name',
    {
      type: Sequelize.STRING,
      allowNull: false,
    },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'name',
  ),
};
