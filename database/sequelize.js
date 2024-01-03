import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  dialectOptions: { useUTC: false },
  timezone: '+7:00',
  logging: false,
});

export default sequelize;
