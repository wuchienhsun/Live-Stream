const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'stream_cate',
  {
    id: {
      type: Sequelize.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    timestamps: false
  }
)
