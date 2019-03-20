import { User } from '../../models';

export default async (email) => {
  try {
    const { dataValues: { verificationId } } = await User.findOne({
      where: {
        email
      }
    });
    return verificationId;
  } catch (error) {
    return error;
  }
};
