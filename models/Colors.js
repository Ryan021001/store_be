import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Color = sequelize.define(
  'colors',
  {
    colorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Color.sync();

export default Color;
