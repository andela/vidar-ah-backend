import { User } from '../../models';

export default async (email) => {
  try {
    await User.update({ verified: true }, { returning: true, where: { email } });
  } catch (error) {
    return error;
  }
};
