
module.exports = {
  up: queryInterface => queryInterface.addConstraint('Users', ['email'], {
    type: 'unique',
    name: 'Email already exists.',
  }),
  down(queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'email'
    );
  },
};
