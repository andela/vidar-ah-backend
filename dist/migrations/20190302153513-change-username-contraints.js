'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.addConstraint('Users', ['username'], {
      type: 'unique',
      name: 'Username already exists.'
    });
  },

  down: function down(queryInterface) {
    return queryInterface.removeColumn('Users', 'username');
  }
};