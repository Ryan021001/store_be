import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Category from './Category.js';
import ProductColor from './ProductColors.js';

const Product = sequelize.define('products', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, Infinity],
    },
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Product.hasMany(ProductColor, { foreignKey: 'productId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.sync();

export default Product;
