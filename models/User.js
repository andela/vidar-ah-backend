import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import shortId from 'shortid';
import sendMail from '../helpers/emails';

dotenv.config();

const { HOST_URL_FRONTEND } = process.env;

module.exports = (sequelize, DataTypes) => {
  const userSchema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists'
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exists'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verificationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetTokenExpires: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM,
      values: ['superadmin', 'admin', 'user'],
      allowNull: false,
      defaultValue: 'user',
      unique: false
    },
    notificationChoice: {
      type: DataTypes.ENUM,
      values: ['appOnly', 'emailOnly', 'both', 'none'],
      allowNull: false,
      defaultValue: 'both',
      unique: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://img.icons8.com/ios-glyphs/30/000000/user.png'
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      unique: false,
      defaultValue: []
    }
  };

  const User = sequelize.define('User', userSchema, {});

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.belongsToMany(models.User, {
      foreignKey: 'followingId',
      as: 'followers',
      through: models.follows
    });
    User.belongsToMany(models.User, {
      foreignKey: 'followerId',
      as: 'following',
      through: models.follows
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.notification, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.belongsToMany(models.Article, {
      foreignKey: 'userId',
      as: 'view',
      through: models.stats
    });
    User.belongsToMany(models.Comment, {
      as: 'commentLiked',
      through: models.commentLikes,
      foreignKey: 'userId',
      targetKey: 'commentId'
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
      link: `${HOST_URL_FRONTEND}/verify/${verificationId}`,
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
