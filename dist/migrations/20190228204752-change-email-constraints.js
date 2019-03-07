'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.addConstraint('Users', ['email'], {
      type: 'unique',
      name: 'Email already exists.'
    });
  },
  down: function down(queryInterface) {
    return queryInterface.removeColumn('Users', 'email');
  }
};