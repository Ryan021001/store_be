import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Role from './Role.js';
import Address from './address.js';

const User = sequelize.define(
  'users',
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // NOT NULL
      validate: {
        len: [3, Infinity],
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        len: [10, 11],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // NOT NULL
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

User.belongsTo(Role, { foreignKey: 'roleId' });
User.sync();

export default User;
