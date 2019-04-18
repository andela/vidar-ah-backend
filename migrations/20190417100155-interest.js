module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'interests',
    {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      unique: false,
      defaultValue: [],
    }
  ),

  down(queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'interests'
    );
  },
};
