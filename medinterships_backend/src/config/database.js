require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config.js');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;
