
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'bio',
    { type: Sequelize.STRING },
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'bio',
  ),
};
