const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Op = require('../../db/db').Op;
const request = require('request');

const upload = require('../../config/multer.config')
const s3 = require('../../config/s3.config');

const User = require('../../model/User');
const Stream = require('../../model/Stream');
const Coin = require('../../model/User_coin_data')
const StreamCate = require('../../model/Stream_cate')
const db = require('../../db/db').sequelize;

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateEmailChange = require('../../validation/email_change');

const s3UploadImg_url = 'https://d6u0gq2utdlwf.cloudfront.net/project_2/'

// Load User model
const replaceword = (word) => word.replace(/\.|\//g, "");

async function createUserData(transaction, id, name) {
  try {
    transaction = await db.transaction();
    await request('https://picsum.photos/200', (err, response) => {
      User.update({ img: response.request.uri.href }, { where: { id } }, { transaction })
    })
    await request('https://picsum.photos/200', (err, response) => {
      Stream.create({
        user_id: id,
        stream_room: name,
        stream_name: '未設置',
        stream_detail: '未設置',
        stream_img: response.request.uri.href
      }, { transaction }).then(res => transaction.commit())
    })
    await Coin.create({ user_id: id, coin: 0 }, { transaction })
  } catch (err) {
    if (err) await transaction.rollback();
    await console.log('err: some err')
  }
}



// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  let transaction
  // Check validation
  if (!isValid) { return res.status(400).json(errors); }
  const { email, name } = req.body
  User.findOrCreate({
    where: { [Op.or]: [{ email }, { name }] },
    defaults: {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      streamKey: replaceword(bcrypt.hashSync(req.body.name + Date.now(), 10)),
    }
  })
    .then(([user, created]) => {
      if (created === false) {
        if (user.dataValues.name === name) {
          if (user.dataValues.email === email) {
            errors.email = 'Email already exists';
            errors.name = 'Name already exists';
            return res.status(400).json(errors);
          } else {
            errors.name = 'Name already exists';
            return res.status(400).json(errors);
          }
        } else {
          errors.email = 'Email already exists';
          return res.status(400).json(errors);
        }
      } else {
        res.json({ success: 'register success' });
        createUserData(transaction, user.id, user.name)
      }
    })
    .catch(err => {
      errors.system = '系統錯誤';
      return res.status(400).json(errors);
    });

});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }
  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then(user => {
      if (user !== null) {
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // Create JWT Payload
              const payload = {
                id: user.id,
                email: user.email,
                name: user.name,
                streamKey: user.streamKey,
                img: user.img
              };
              // Sign Token
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 36000 },
                (err, token) => { res.json({ success: true, token: 'Bearer ' + token }); }
              );
            } else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
          })
          .catch(err => res.status(404).json(err))
      } else {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
    })
})

// @route   GET api/user/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    streamKey: req.user.streamKey,
    img: req.user.img
  });
}
);

// @route   GET api/user/streamKey
// @desc    get user streamKey
// @access  public
router.post('/streamKey', (req, res) => {
  const { user_name } = req.body
  User.findOne({ where: { name: user_name } })
    .then(user => {
      if (user !== null) {
        Stream.findOne({ where: { user_id: user.id } })
          .then(stream => {
            StreamCate.findOne({ where: { id: stream.stream_id } })
              .then(cate => {
                if (stream !== 0) {
                  res.json({
                    Key: user.streamKey,
                    Name: stream.stream_name,
                    Detail: stream.stream_detail,
                    Cate: cate.name,
                    host: user_name,
                    id: user.id
                  })
                } else {
                  return res.json({
                    Key: user.streamKey,
                    Name: '沒有實況名稱 = =',
                    Detail: '沒有實況介紹',
                    host: user_name,
                    id: user.id
                  })
                }
              })
              .catch(err => res.status(404).json({ err }))
          })
          .catch(err => res.status(404).json({ err }))
      }
    })
    .catch(err => res.status(404).json({ err }))
})


// @route   POST api/user/email_change
// @desc    change user email
// @access  Private
router.post('/email_change', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEmailChange(req.body);
  if (!isValid) { return res.status(400).json(errors); }
  const { email } = req.body;
  User.findOne({ where: { email } })
    .then(data => {
      if (data !== null) {
        errors.email = '信箱已被使用過，請改用其他信箱';
        return res.status(400).json(errors);
      } else {
        User.update({ email }, { where: { id: req.user.id } })
          .then(datas => { return res.json({ msg: '修改成功，請重新登入' }) })
          .catch(err => res.status(404).json({ err }))
      }
    })
})

// @route   POST api/user/img_change
// @desc    change user img
// @access  Private
router.post('/img_change', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
  const { originalname, buffer } = req.file;
  const s3Client = s3.s3Client;
  const params = s3.uploadImgParams;
  params.Key = originalname;
  params.Body = buffer;
  s3Client.upload(params, (err, data) => {
    if (err) { res.status(400).json({ error: "Error -> " + err }); }
    let obj = { img: s3UploadImg_url + originalname }
    User.update(obj, { where: { id: req.user.id } })
      .then(datas => { res.json(obj) })
      .catch(err => res.status(404).json({ err }))
  });
})

module.exports = router
