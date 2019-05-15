const express = require('express');
const router = express.Router();
const passport = require('passport');

const User_coin = require('../../model/User_coin_data');

// @route   post api/coin/
// @desc    get current coin
// @access  private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let { id, name } = req.user
  User_coin.findAll({ where: { user_id: id } })
    .then(datas => { if (datas.length === 0) { return res.json({ coin: 0 }) } res.json({ coin: [datas[0].coin] }); })
})
module.exports = router