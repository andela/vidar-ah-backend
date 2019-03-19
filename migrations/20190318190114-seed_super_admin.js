require('dotenv').config();

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: process.env.SUPER_ADMIN_EMAIL,
          password: bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
          name: process.env.SUPER_ADMIN_NAME,
          username: process.env.SUPER_ADMIN_USERNAME,
          role: 'superadmin',
          verified: true,
          verificationId: 'superadmin',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete(
      'Users',
      [{
        email: 'ekundayo@gmail.com'
      }
      ]
    );
  },
};
