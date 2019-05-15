const express = require('express');
const router = express.Router();
const passport = require('passport');


const User_coin = require('../../model/User_coin_data');
const User_donate = require('../../model/User_donate_data');

// @route   POST api/donate/
// @desc    user donate to stream host
// @access  private
router.post('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //捐錢的人
    let donate_user = req.user.id;
    //被捐的數目，被捐獻者
    let { host } = req.body
    let amount = parseInt(req.body.amount)
    //先檢查捐錢者 帳戶內是否足夠
    let donate_select = { where: { user_id: donate_user } }
    let donated_select = { where: { user_id: host } }
    // check amount 是不是數字
    User_coin.findAll(donate_select)
      .then((datas) => {
        //如果有這個使用者
        if (datas.length === 1) {
          let u_data = datas[0].dataValues
          //確認金額是否足夠
          let count = parseInt(u_data.coin) - parseInt(amount)
          if (count >= 0) {
            //金額足夠 count是捐款後剩餘金額 update 
            User_coin.update({
              coin: count
            }, donate_select)
              .then((result) => {
                //stream host udpate coins amount
                User_coin.findAll(donated_select)
                  .then(datas => {
                    //確定有沒有這人
                    if (datas.length === 1) {
                      let data = datas[0].dataValues
                      let total = parseInt(data.coin) + parseInt(amount)
                      User_coin.update({
                        coin: total
                      }, donated_select)
                        .then(results => {
                          let sql = {
                            user_id: donate_user,
                            host: host,
                            coin: amount
                          }
                          User_donate.create(sql).then((datas) => {
                            if (datas) {
                              let data = datas.dataValues
                              res.json({
                                status: true,
                                donate_user: { user_id: data.user_id, name: req.user.name, coin: data.coin },
                                host: { host_id: data.host }
                              })
                            } else { return res.status(400).json({ errors: 'Error happend' }) }
                          })
                            .catch(err => { return res.status(400).json(err) })
                        })
                        .catch(err => { return res.status(400).json(err) })
                    } else { res.status(400).json({ errors: 'Coins not enough' }) }
                  })
              })
              .catch(err => { return res.status(400).json(err) })
          } else {
            //金額不足
            return res.status(400).json({ errors: 'Coins not enough' })
          }
        } else {
          // no this user
          return res.status(400).json({ errors: 'Coins not enough' })
        }
      })
      .catch(err => { return res.status(400).json(err) })
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