const express = require('express');
const router = express.Router();
const passport = require('passport');

const User_coin = require('../../model/User_coin_data');

// @route   post api/coin/
// @desc    get current coin
// @access  private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User_coin.findOne({ where: { user_id: req.user.id } })
    .then(datas => {
      if (datas === null) { return res.json({ coin: 0 }) } res.json({ coin: datas.coin });
    })
})
module.exports = router