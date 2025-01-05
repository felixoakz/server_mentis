import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'mentis', // Database name
  'root',   // Username
  '12345',  // Password
  {
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false, // Disable query logs
  }
);

export default sequelize;
