module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'image',
    {
      type: Sequelize.STRING,
    }
  ),

  down: queryInterface => queryInterface.removeColumn('Users', 'image')
};
