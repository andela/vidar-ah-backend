module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'passwordResetToken',
    { type: Sequelize.STRING }
  )
    .then(() => queryInterface.addColumn(
      'Users',
      'passwordResetTokenExpires',
      { type: Sequelize.STRING }
    )),
  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'passwordResetToken'
  )
    .then(() => queryInterface.removeColumn(
      'Users',
      'passwordResetTokenExpires'
    ))
};
