const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../../db/db').sequelize;


const User_coin = require('../../model/User_coin_data');
const User_donate = require('../../model/User_donate_data');

// @route   POST api/donate/
// @desc    user donate to stream host
// @access  private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const donate_user = req.user.id,
    { host } = req.body,
    amount = parseInt(req.body.amount)
  return db.transaction(transaction => {
    return User_coin.findOne({ where: { user_id: donate_user }, transaction })
      .then((u_data) => {
        //如果有這個使用者
        if (u_data !== null) {
          //確認金額是否足夠
          let count = parseInt(u_data.coin) - parseInt(amount)
          if (count >= 0) {
            //金額足夠 count是捐款後剩餘金額 update 
            return User_coin.update({
              coin: count
            }, { where: { user_id: donate_user }, limit: 1, lock: true, transaction })
              .then((result) => {
                //stream host udpate coins amount
                return User_coin.findOne({ where: { user_id: host }, transaction })
                  .then(datas => {
                    //確定有沒有這人
                    if (datas !== null) {
                      let total = parseInt(datas.coin) + parseInt(amount)
                      return User_coin.update({
                        coin: total
                      }, { where: { user_id: host }, limit: 1, lock: true, transaction })
                        .then(results => {
                          let sql = {
                            user_id: donate_user,
                            host: host,
                            coin: amount
                          }
                          return User_donate.create(sql, { transaction }).then((datas) => {
                            if (datas) {
                              res.json({
                                status: true,
                                donate_user: { user_id: datas.user_id, name: req.user.name, coin: datas.coin },
                                host: { host_id: datas.host }
                              })

                            } else {
                              return res.status(400).json({ errors: 'Error happend' })
                            }
                          })
                            .catch(err => { return res.status(400).json(err) })
                        })
                        .catch(err => { return res.status(400).json(err) })
                    } else {
                      // transaction.rollback();
                      return res.status(400).json({ errors: 'Coins not enough' })
                    }
                  }).catch(err => { return res.status(400).json(err) })
              }).catch(err => { return res.status(400).json(err) })
          } else {
            return res.status(400).json({ errors: 'Coins not enough' })
          }
        } else {
          return res.status(400).json({ errors: 'Coins not enough' })
        }
      })
      .catch(err => { return res.status(400).json(err) })
  });
})


// @route   POST api/donate/list
// @desc    user donate to stream host list
// @access  private
router.get('/list',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    User_donate.findAll({ where: { user_id: req.user.id } })
      .then(datas => { if (datas.length === 0) { res.json({ msg: '沒有打賞紀錄' }) } else { res.json(datas); } })
      .catch(err => res.status(404).json(err))
  })

module.exports = router