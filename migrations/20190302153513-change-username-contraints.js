
module.exports = {
  up: queryInterface => queryInterface.addConstraint('Users', ['username'], {
    type: 'unique',
    name: 'Username already exists.',
  }),

  down(queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'username'
    );
  },
};
