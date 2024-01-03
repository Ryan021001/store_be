import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Address = sequelize.define(
  'addresses',
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    district: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

Address.sync();

export default Address;
