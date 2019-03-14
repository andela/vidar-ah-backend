module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'userId',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  ),

  down(queryInterface) {
    return queryInterface.removeColumn(
      'Articles',
      'userId'
    );
  },
};
