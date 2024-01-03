import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './User.js';
import CartItem from './CartItem.js';

const Cart = sequelize.define(
  'carts',
  {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

Cart.sync();

export default Cart;
