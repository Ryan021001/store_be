import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Role = sequelize.define(
  'roles',
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Role.sync();

export default Role;
