const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../../model/Order');
const User_coin = require('../../model/User_coin_data');
require("dotenv").config();
const cache = require("memory-cache");
const uuid = require('uuid')
const line_pay = require("line-pay");
const pay = new line_pay({
    channelId: '1565571453',
    channelSecret: '79d947dde411cc38096de23cc1f31c96',
    isSandbox: true
});

// @route   POST api/checkout/pay:method/reserve
// @desc    buy Coin and insert Order
// @access  Private
router.post("/pay:method/reserve", passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.id
    let { method } = req.params
    let options = {
        productName: "z",
        amount: 1000,
        currency: "TWD",
        orderId: uuid(),
        confirmUrl: 'https://www.wuhsun.com/api/checkout/pay/confirm'
        // confirmUrl: 'http://localhost:5000/api/checkout/pay/confirm'

    }
    switch (method) {
        case method = 'a':
            options.productName = '100coins'
            options.amount = 50
            break;
        case method = 'b':
            options.productName = '500coins'
            options.amount = 250
            break;
        case method = 'c':
            options.productName = '1000coins'
            options.amount = 500
            break;
        default:
            res.status(400).json({ msg: 'error' })
            break;
    }

    pay.reserve(options).then((response) => {
        let reservation = options;
        reservation.coin = options.amount * 2
        reservation.transactionId = response.info.transactionId;

        console.log(`Reservation was made. Detail is following.`);
        console.log(reservation);
        reservation.user_id = user_id
        Order.create(reservation)
            .then(data => {
                cache.put(reservation.transactionId, reservation);
                res.send(response.info.paymentUrl.web);
            })
            .catch(err => res.status(400).json({ err }))
    })
        .catch(err => res.status(400).json({ err }))
});

// @route   get api/checkout/pay/confirm
// @desc    buy Coin check page and update Order status and plus coin amount
// @access  public
router.get("/pay/confirm", (req, res) => {
    console.log("confirm");
    if (!req.query.transactionId) {
        throw new Error("Transaction ID is not found");
    };

    let reservation = cache.get(req.query.transactionId);
    if (!reservation) {
        throw new Error("reservation is not found");
    };

    console.log("retrieved following reservation");
    console.log(reservation);

    let confirmation = {
        transactionId: req.query.transactionId,
        amount: reservation.amount,
        currency: reservation.currency
    };

    console.log(`Going to confirm payment with following options.`);
    console.log(confirmation);


    pay.confirm(confirmation).then((response) => {
        const select = { where: { transactionId: confirmation.transactionId } }
        Order.findAll(select)
            .then((datas) => {
                const data = datas[0].dataValues
                const coin = data.coin
                Order.update({
                    pay_succ: true
                }, select)
                    .then((result) => {
                        let where = { where: { user_id: data.user_id } }
                        User_coin.findAll(where)
                            .then(u_datas => {
                                if (u_datas.length === 0) {
                                    let sql = { user_id: data.user_id, coin: coin }
                                    User_coin.create(sql)
                                        .then(create_result => { return res.send("付款完成，可以關閉此頁"); })
                                }
                                let newCoin = u_datas[0].coin + coin
                                User_coin.update({ coin: newCoin }, where)
                                    .then(results => { res.send("付款完成，可以關閉此頁"); })
                            })
                    })
                    .catch(err => res.status(400).json({ err }))

            })
            .catch(err => res.status(400).json({ err }))

    });
});

// @route   POST api/checkout/details
// @desc    see buy coin details
// @access  Private
router.get('/details', passport.authenticate('jwt', { session: false }), (req, res) => {
    const select = { where: { user_id: req.user.id } };
    Order.findAll(select)
        .then(datas => {
            if (datas.length === 0) {
                res.json({ data: 'No Coin Data' })
            } else {
                let data = []
                for (let i = 0; i < datas.length; i++) {
                    data.push(datas[i].dataValues);
                }
                res.send(data);
            }
        })
})

module.exports = router;
