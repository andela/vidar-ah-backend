import { User } from '../../models';

export default async (email, role) => {
  try {
    await User.update({ role }, { where: { email } });
  } catch (error) {
    return error;
  }
};
