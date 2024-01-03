import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Color from './Colors.js';
import Product from './Product.js';

const CartItem = sequelize.define(
  'cartItems',
  {
    cartItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

CartItem.belongsTo(Color, { foreignKey: 'colorId' });
CartItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

CartItem.sync();

export default CartItem;
