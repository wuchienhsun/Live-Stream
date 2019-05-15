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

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateEmailChange = require('../../validation/email_change');

const s3UploadImg_url = 'https://d6u0gq2utdlwf.cloudfront.net/project_2/'

// Load User model
function replaceword(word) {
  return word.replace(/\.|\//g, "");
}

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) { return res.status(400).json(errors); }
  const { email, name } = req.body
  request('https://picsum.photos/200', (error, response, body) => {
    console.log('img href', response.request.uri.href)
    User.findOrCreate({
      where: { [Op.or]: [{ email }, { name }] },
      defaults: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        streamKey: replaceword(bcrypt.hashSync(req.body.name + Date.now(), 10)),
        img: response.request.uri.href
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
          Coin.create({ user_id: user.id, coin: 0 }).then(datas => {
            request('https://picsum.photos/200', (error, response, body) => {
              console.log('img href', response.request.uri.href)
              Stream.create({
                user_id: user.id,
                stream_room: user.name,
                stream_name: '未設置',
                stream_detail: '未設置',
                stream_img: response.request.uri.href
              }).then(datas => { res.json(user); })
                .catch(err => {
                  errors.system = '系統錯誤';
                  return res.status(400).json(errors);
                })
            })
          })
        }
      })
      .catch(err => {
        errors.system = '系統錯誤';
        return res.status(400).json(errors);
      });
  })
});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }
  const { email, password } = req.body;
  User.findAll({ where: { email } })
    .then(data => {
      // Check for user
      if (data.length === 1) {
        let user = data[0].dataValues
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
  User.findAll({ where: { name: user_name } })
    .then(datas => {
      let data = datas[0].dataValues
      if (datas.length === 1) {
        Stream.findAll({ where: { user_id: data.id } })
          .then(result => {
            StreamCate.findAll({ where: { id: result[0].dataValues.stream_id } })
              .then(final => {
                if (result.length === 0) {
                  return res.json({
                    Key: data.streamKey,
                    Name: '沒有實況名稱 = =',
                    Detail: '沒有實況介紹',
                    host: user_name,
                    id: data.id
                  })
                } else {
                  res.json({
                    Key: data.streamKey,
                    Name: result[0].dataValues.stream_name,
                    Detail: result[0].dataValues.stream_detail,
                    Cate: final[0].dataValues.name,
                    host: user_name,
                    id: data.id
                  })
                }
              }).catch(err => res.status(404).json({ err }))
          })
          .catch(err => res.status(404).json({ err }))
        // res.json({Key:data.streamKey,Name})
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
  User.findAll({ where: { email } })
    .then(data => {
      if (data.length === 0) {
        User.update({ email }, { where: { id: req.user.id } })
          .then(datas => { return res.json({ msg: '修改成功，請重新登入' }) })
          .catch(err => res.status(404).json({ err }))
      } else {
        errors.email = '信箱已被使用過，請改用其他信箱';
        return res.status(400).json(errors);
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
