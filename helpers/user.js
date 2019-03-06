import { User } from '../models';

/**
 * @description Return user name
 * @param {string} email user email
 * @returns {promise} promise object
 */
const getName = async (email) => {
  const name = await User.findOne({ where: { email } });
  return name.dataValues.name;
};
export default getName;
