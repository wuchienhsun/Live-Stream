const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'user_stream_data',
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
    stream_id: {
      type: Sequelize.BIGINT(11),
      allowNull: true
    },
    stream_room: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stream_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stream_detail: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stream_img: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stream: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  { 
    timestamps: false
  }
)
