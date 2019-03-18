module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Categories',
    [
      {
        categoryName: 'Uncategorized',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  ),

  down: queryInterface => queryInterface.bulkDelete(
    'Categories',
    [
      {
        categoryName: 'Uncategorized'
      }
    ]
  ),
};
