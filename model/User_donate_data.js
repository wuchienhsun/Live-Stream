const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'user_donate_data',
  {
    id: {
      type: Sequelize.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.BIGINT(11),
      allowNull: false
    },
    host: {
      type: Sequelize.BIGINT(11),
      allowNull: false
    },
    coin: {
      type: Sequelize.BIGINT(11),
      allowNull: false
    }
  },
  { 
    timestamps: false
  }
)