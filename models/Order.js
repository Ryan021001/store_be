import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './User.js';
import OrderItem from './OrderItem.js';

const Order = sequelize.define(
  'orders',
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
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
  },
  {
    timestamps: false,
  }
);

Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

Order.sync();

export default Order;
