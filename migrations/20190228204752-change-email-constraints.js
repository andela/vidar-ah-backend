
module.exports = {
  up: queryInterface => queryInterface.addConstraint('Users', ['email'], {
    type: 'unique',
    name: 'Email already exists.',
  }),
};
