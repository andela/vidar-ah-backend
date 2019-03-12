import { User } from '../../models';

export default async (email) => {
  try {
<<<<<<< HEAD
    await User.update({ verified: true }, { returning: true, where: { email } });
=======
    await User.update({ verified: true }, { where: { email } });
>>>>>>> ft-create-user-article-#164139686
  } catch (error) {
    return error;
  }
};
