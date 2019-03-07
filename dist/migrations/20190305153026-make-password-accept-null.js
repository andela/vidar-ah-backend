'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', ['password'], {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'password');
  }
};