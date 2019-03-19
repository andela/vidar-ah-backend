// import dotenv from 'dotenv';

// dotenv.config();
// import bcrypt from 'bcrypt';

// console.log('>>>>>>>>>>>>> here >>>>>>>>>>>>>');

// const pwd = bcrypt.hashSync('superpassword', bcrypt.genSaltSync(10));
// console.log(pwd);

module.exports = {
  up: async (queryInterface) => {
    // const pwd = await bcrypt.hashSync('superpassword', bcrypt.genSaltSync(10));
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'ekundayo@gmail.com',
          // password: pwd,
          password: '$2b$10$M7FL44WKAVPZs5fsoRWk4eloOaTRbveA.btL8KyEAA6Yt4sfLfsa2', // superpassword
          name: 'ekundayo Abiono',
          username: 'ekundayo',
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

// email: process.env.SUPER_ADMIN_EMAIL,
// password: process.env.SUPER_ADMIN_PASSWORD,
// name: process.env.SUPER_ADMIN_NAME,
// username: process.env.SUPER_ADMIN_USERNAME,
