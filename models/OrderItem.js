import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Product from './Product.js';
import Color from './Colors.js';

const OrderItem = sequelize.define(
  'orderItems',
  {
    orderItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(Color, { foreignKey: 'colorId' });

OrderItem.sync();

export default OrderItem;
