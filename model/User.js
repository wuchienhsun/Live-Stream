const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    streamKey: {
      type: Sequelize.STRING
    },
    img: {
      type: Sequelize.STRING
    },
  },
  {
    timestamps: false
  }
)
