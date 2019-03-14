import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import shortId from 'shortid';
import sendMail from '../helpers/emails';

dotenv.config();

const { HOST_URL } = process.env;

module.exports = (sequelize, DataTypes) => {
  const userSchema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists',
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exists',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetTokenExpires: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  };

  const User = sequelize.define('User', userSchema, {});

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  User.hook('beforeValidate', (user) => {
    user.verificationId = shortId.generate();
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    }
  });
  User.hook('afterCreate', (user) => {
    const { email, name, verificationId } = user;
    const emailPayload = {
      name,
      email,
      link: `${HOST_URL}/api/v1/verify/${verificationId}`,
      subject: "Welcome to Author's Haven",
      message: 'verify your account'
    };
    sendMail(emailPayload);
  });

  // eslint-disable-next-line func-names
  User.prototype.verifyAccount = async function () {
    this.verified = true;
    this.verificationId = null;
    await this.save();
    return this;
  };
  return User;
};
