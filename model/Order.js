const Sequelize = require('sequelize');
const db = require('../db/db');
module.exports = db.sequelize.define(
  'order',
  {
    id: {
      type: Sequelize.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },    
    productName: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    coin: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    transactionId: {
      type: Sequelize.BIGINT(11),
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT(11),
      allowNull: false
    },
    pay_succ: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  },  
  { 
    timestamps: false
  }
)