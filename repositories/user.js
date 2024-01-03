import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Exception from '../exceptions/Exception.js';
import Role from '../models/Role.js';
import { Address, User } from '../models/index.js';
import uploadToCloudinary from '../utils/cloudinary.js';

const getUsers = async (limit, page) => {
  try {
    const offset = (page - 1) * limit;
    const users = await User.findAll({
      limit: limit,
      offset: offset,
      attributes: ['userId', 'name', 'email', 'phoneNumber'],
      include: [{ model: Role }],
      order: [['userId', 'ASC']],
    });
    return users.map((item) => {
      return {
       ...item.dataValues,
       'role': item.role.name,
      }
    });
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Role }],
    });
    if (!user) {
      throw new Exception(Exception.CANNOT_FIND_USER_BY_ID + ': ' + userId);
    }
    const address = await Address.findAll({ where: { userId } });
    user.dataValues.role = user.role.name;
    user.dataValues.sizeAddresses = address.length;
    return user;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Exception(Exception.USER_NOT_FOUND);
    }
    await user.destroy();
    return null;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Role,
        },
      ],
      attributes: ['userId', 'name', 'email', 'password'],
    });

    if (!user) {
      throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    const token = jwt.sign(
      {
        data: user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30 days',
      }
    );

    user.dataValues.role = user.role.name;

    return {
      ...user.dataValues,
      token: token,
    };
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const register = async ({ name, email, password, roleId }) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new Exception(Exception.USER_EXIST);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: roleId || 2,
    });
    return { ...newUser.dataValues, password: 'Not show' };
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const updateUser = async ({ userId, name, email, roleId, image, phoneNumber }) => {
  try {
    const user = await User.findByPk(userId, {attributes: ['userId', 'name', 'email', 'phoneNumber', 'image']});
    if (!user) {
      throw new Exception(Exception.USER_NOT_FOUND);
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.roleId = roleId ?? user.roleId;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;

    if (image) {
    const result = await uploadToCloudinary(image);
      user.image = result.url;
    }

    await user.save();
    return user;
  } catch (exception) {
    throw new Exception(exception.message);
  }
};

const changePassword = async ({ userId, password, newPassword }) => {
  try {
    if (password === newPassword) {
      throw new Exception(Exception.WRONG_PASSWORD);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Exception(Exception.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Exception(Exception.WRONG_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS)
    );

    user.password = hashedPassword;

    await user.save();
    return user;
  } catch (exception) {
    throw new Exception(exception.message);
  }
}

export default {
  getUsers,
  getUserById,
  deleteUser,
  login,
  register,
  updateUser,
  changePassword,
};
