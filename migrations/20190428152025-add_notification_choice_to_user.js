module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(
      'CREATE TYPE "notificationChoiceType" AS ENUM(\'appOnly\', \'emailOnly\', \'both\', \'none\'); ALTER TABLE "Users" ADD COLUMN "notificationChoice" "notificationChoiceType";'
    );
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(
      'ALTER TABLE "Users" DROP COLUMN "notificationChoice"; DROP TYPE "notificationChoiceType";'
    );
  }
};
