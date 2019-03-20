module.exports = {
  up: queryInterface => queryInterface.addIndex('Articles', ['title', 'description']),
  down: queryInterface => queryInterface.removeIndex('Articles', ['title', 'description']),
};
