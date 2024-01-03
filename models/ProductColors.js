import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Color from './Colors.js';

const ProductColor = sequelize.define(
  'productColors',
  {
    productColorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
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

ProductColor.belongsTo(Color, { foreignKey: 'colorId' });

ProductColor.sync();

export default ProductColor;
