const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'videos',
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
    video_name: {
      type: Sequelize.STRING
    },
    video_url: {
      type: Sequelize.STRING
    },
    video_path: {
      type: Sequelize.STRING
    },
    views: {
      type: Sequelize.BIGINT(11),
    },
  },
  {
    timestamps: false
  }
)
