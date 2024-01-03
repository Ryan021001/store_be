import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './User.js';
import Product from './Product.js';

const Favorite = sequelize.define(
  'favorites',
  {
    favoriteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Favorite.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Favorite.sync();

export default Favorite;
