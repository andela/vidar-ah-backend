import { User } from '../../models';

/**
 * @description Return user id
 * @param {string} email user email
 * @returns {promise} promise object
 */
const getId = async (email) => {
  const name = await User.findOne({ where: { email } });
  return name.dataValues.id;
};
export default getId;
