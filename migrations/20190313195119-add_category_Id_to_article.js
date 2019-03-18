module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'categoryId',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false
    }
  ),

  down(queryInterface) {
    return queryInterface.removeColumn(
      'Articles',
      'categoryId'
    );
  },
};
