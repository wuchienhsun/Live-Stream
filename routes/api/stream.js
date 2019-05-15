const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const request = require('request');

// modal
const User = require('../../model/User');
const Stream = require('../../model/Stream')
const StreamCate = require('../../model/Stream_cate')
const Op = require('../../db/db').Op;

// S3 upload
const upload = require('../../config/multer.config')
const s3 = require('../../config/s3.config');

// valid func
const validateStreamInput = require('../../validation/stream_data');

// unique string
const s3UploadImg_url = 'https://d6u0gq2utdlwf.cloudfront.net/project_2/'

// @route   GET api/stream/data
// @desc    send stream data
// @access  Public
router.get('/data', passport.authenticate('jwt', { session: false }), (req, res) => {
  let select = { where: { user_id: req.user.id } }
  Stream.findAll(select)
    .then(data => { res.json(data[0]); })
    .catch(err => res.status(400).json(err));
})



// @route   POST api/stream/data
// @desc    send and update stream data
// @access  Public
router.post('/data', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateStreamInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }
  let results = {}
  let select = { where: { user_id: req.user.id } }
  Stream.findAll(select)
    .then(result => {
      if (result.length === 0) {
        request('https://picsum.photos/200', (error, response, body) => {
          Stream.create({
            user_id: req.user.id,
            stream_room: req.user.name,
            stream_name: req.body.stream_name,
            stream_id: req.body.stream_cate,
            stream_detail: req.body.stream_detail,
            stream_img: response.request.uri.href
          })
            .then(data => {
              let stream_data = data[0].dataValues
              results.stream_data = stream_data;
              results.update = false;
              return res.json(result);
            }).catch(err => res.status(400).json(err));
        })
      } else {
        Stream.update({
          user_id: req.user.id,
          stream_name: req.body.stream_name,
          stream_id: req.body.stream_cate,
          stream_detail: req.body.stream_detail
        }, select)
          .then(data => {
            results.stream_data = {
              user_id: req.user.id,
              stream_room: req.user.name,
              stream_name: req.body.stream_name,
              stream_cate: req.body.stream_cate,
              stream_detail: req.body.stream_detail
            }
            results.update = true;
            return res.json(results)
          })
          .catch(err => console.log(err));
      }
    }).catch(err => res.status(404).json(err))
})

// @route   POST api/stream/open
// @desc    stream start
// @access  Public
router.post('/open', (req, res) => {
  let { StreamPath } = req.body;
  let newStream = StreamPath.substr(6);
  let select = { where: { streamKey: newStream } }
  User.findAll(select)
    .then(datas => {
      if (datas.length === 1) {
        let data = datas[0]
        let s_select = { where: { user_id: data.id } }
        Stream.findAll(s_select)
          .then(datas => {
            if (datas.length === 1) {
              Stream.update({ stream: true }, s_select)
                .then(result => { res.send('Stream is open'); })
            }
          }).catch(err => res.status(404).json(err))
      } else { res.status(400).json({ errors: 'logic error' }) }
    }).catch(err => res.status(404).json(err))
});



// @route   POST api/stream/close
// @desc    stream close
// @access  Public
router.post('/close', (req, res) => {
  let { StreamPath } = req.body;
  let newStream = StreamPath.substr(6);
  console.log('newStream', newStream)
  let select = { where: { streamKey: newStream } }
  User.findAll(select)
    .then(datas => {
      if (datas.length === 1) {
        let data = datas[0]
        let s_select = { where: { user_id: data.id } }
        Stream.findAll(s_select)
          .then(datas => {
            if (datas.length === 1) {
              Stream.update({ stream: false }, s_select)
                .then(result => { res.send('Stream is close'); })
            }
          }).catch(err => res.status(404).json(err))
      } else { return res.status(400).json({ errors: 'logic error' }) }
    }).catch(err => res.status(404).json(err))
})


// @route   GET api/stream/onstream
// @desc    user is streaming
// @access  public
router.get('/onstream', (req, res) => {
  let select = { where: { stream: true } }
  Stream.findAll(select)
    .then(datas => { if (datas.length === 0) { res.send([]); } else { res.send(datas); } })
    .catch(err => res.status(404).json(err))
})


// @route   GET api/stream/cate
// @desc    get stream cate list
// @access  public
router.get('/cate', (req, res) => {
  StreamCate.findAll()
    .then(datas => { res.send(datas); })
    .catch(err => res.status(404).json(err))
})




// @route   POST api/stream/img_change
// @desc    change stream img
// @access  Private
router.post('/img_change', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
  let times = Date.parse(new Date());
  const s3Client = s3.s3Client;
  const params = s3.uploadImgParams;
  params.Key = times + req.file.originalname;
  params.Body = req.file.buffer;

  s3Client.upload(params, (err, data) => {
    if (err) { return res.status(400).json({ error: "Error -> " + err }); }
    Stream.update({ stream_img: s3UploadImg_url + times + req.file.originalname }, { where: { user_id: req.user.id } })
      .then(datas => { res.json({ stream_img: s3UploadImg_url + times + req.file.originalname }) })
      .catch(err => res.status(404).json(err))
  });
})

module.exports = router;
