import dotenv from 'dotenv';

dotenv.config();

const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  SUPER_ADMIN_USERNAME
} = process.env;

export const superAdmin = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
  username: SUPER_ADMIN_USERNAME
};

export default {
  username: 'flippin',
  email: 'flipping2234@gmail.com',
  name: 'Flipping James',
  password: '1234567'
};

export const user2 = {
  username: 'flippingg',
  email: 'flippingg2234@gmail.com',
  name: 'Flippingg James',
  password: '1234567g'
};

export const user3 = {
  name: 'Olamilekan',
  username: 'leksyib',
  email: 'leksyib1t4@gmail.com',
  password: '1234567g',
  interests: 'Sports'
};

export const validUser = {
  username: 'JamesBond',
  email: 'jamesbondxxc@gmail.com',
  name: 'James Bond',
  password: '1234567'
};

export const validCommentUser = {
  username: 'MuhammaduBuhari',
  email: 'ayinlaolajide099@gmail.com',
  name: 'Muhammadu Buhari',
  password: '1234567'
};

export const validLikeCommentUser = {
  username: 'FelaAnikulapo',
  email: 'felasssss@gmail.com',
  name: 'Fela Kuti',
  password: '1234567'
};

export const wrongCommentUser = {
  username: 'AishaBuhari',
  email: 'ayinlaolajide2345@gmail.com',
  name: 'Aisha Buhari',
  password: '1234567'
};

export const wrongLikeCommentUser = {
  username: 'JohnDoe',
  email: 'johndoe2345@gmail.com',
  name: 'John Doe',
  password: '1234567'
};

export const validUser1 = {
  username: 'fflippin',
  email: 'fflipping2234@gmail.com',
  name: 'Fflipping James',
  password: '1234567'
};

export const helperUser = {
  username: 'AyinlaOlajide',
  email: 'helperuser@gmail.com',
  name: 'Ayinla Olajide',
  password: '1234567'
};

export const profileDetails = {
  firstname: 'NewFirstName',
  lastname: 'NewLastName',
  bio: 'I love playing basketball'
};

export const newUser = {
  email: 'testing123559@gmail.com',
  password: 'testing',
  name: 'testing testing',
  username: 'testing123559'
};
export const newUser2 = {
  email: 'testing2@gmail.com',
  password: 'testing',
  name: 'testing testing',
  username: 'testing223559'
};

export const validLoginUser = {
  email: 'testing123559@gmail.com',
  password: 'testing'
};

export const myUser = {
  username: 'Alex20',
  email: 'jacynnad120@gmail.com',
  name: 'Jacy20',
  password: 'password'
};
export const validUser2 = {
  username: 'testuser',
  email: 'jessam7009@gmail.com',
  name: 'Flipping James',
  password: 'abcdef',
  verified: true
};

export const invalidUser = {
  email: 'email@domain.com'
};

export const validFollowUser = {
  username: 'validfollowuser',
  email: 'jessam70010@gmail.com',
  name: 'Flipping James',
  password: 'abcdef',
  verified: true
};

export const validFollowUser2 = {
  username: 'followuser2',
  email: 'jessam70011@gmail.com',
  name: 'Flipping James',
  password: 'abcdef',
  verified: true
};

export const validUser3 = {
  name: 'validUser3',
  email: 'validUser3@gmail.com',
  password: 'validUser3',
  username: 'validuser3'
};

export const validUser4 = {
  name: 'validUser4',
  email: 'validUser4@gmail.com',
  password: 'validUser4',
  username: 'validuser4'
};

export const validStatUser = {
  username: 'validstatuser',
  email: 'jessamstat@gmail.com',
  name: 'Flipping James',
  password: 'abcdef',
  verified: true
};
