const express = require('express');
const router = express.Router();
const passport = require('passport');
const Video = require('../../model/Video')
const crypto = require('crypto');
const uploadVideo = require('../../config/multer')

const move = require('../../middle/changefile');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const ytdl = require('@microlink/youtube-dl')
const path = require('path')

const s3 = require('../../config/s3.config');

const s3UploadVideo_url = 'https://d6u0gq2utdlwf.cloudfront.net/project_2/video/'
const s3Client = s3.s3Client;



//          //
//          //
// FUNCTION //
//          //
//          //

const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
}

const readVideoBuffer = (path, id, originalname, callback) => {
  fs.readFile(path, (err, fileBuffer) => {
    if (err) throw err;
    let times = Date.parse(new Date()).toString();
    let filename = md5(times).substring(0, 6)
    let paramsKey = filename + '.mp4'
    s3uploadFunc(paramsKey, fileBuffer, id, originalname, filename, (obj) => {
      callback(obj)
    })
  })
}

const ytdlFunc = (videoUserPath, url, id, callback) => {
  let video = ytdl(url, ['--format=18'], { cwd: videoUserPath });
  video.on('info', function (info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    let originalVideoName = info._filename
    let videodl = video.pipe(fs.createWriteStream(path.join(videoUserPath, info._filename)));
    let times = Date.parse(new Date()).toString();
    let filename = md5(times).substring(0, 6) + '.mp4'
    let filepath = md5(times).substring(0, 6)
    videodl.on('finish', () => {
      fs.readFile(path.join(videoUserPath, originalVideoName), (err, data) => {
        if (err) throw err;
        s3uploadFunc(filename, data, id, originalVideoName, filepath, (obj) => {
          callback(obj)
        })
      })
    })
  })
}

const s3uploadFunc = (paramsKey, paramsBody, userID, originalVideoName, VideoPath, callback) => {
  const params = s3.uploadVideoParams;
  params.Key = paramsKey;
  params.Body = paramsBody;
  let obj = {
    user_id: userID,
    video_name: originalVideoName,
    video_path: VideoPath,
    video_url: 'https://d6u0gq2utdlwf.cloudfront.net/project_2/video/' + paramsKey,
    views: 0
  }
  s3Client.upload(params)
    .on('httpUploadProgress', (progress) => {
      // console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
      // nsp.to(socketid).emit('S3uploadProgress',Math.round(progress.loaded/progress.total*100)+ '% done');
    })
    .send((err, data) => {
      if (err) {
        return res.status(400).json({ error: "Error -> " + err });
      } else {
        console.log(data);
        callback(obj)
      }
    })
}
//          //
//          //
// FUNCTION //
//          //
//          //

// @route   POST api/video/upload
// @desc    upload user video
// @access  private
router.post('/upload', passport.authenticate('jwt', { session: false }), uploadVideo.single('file'), (req, res, next) => {
  if (req.file.mimetype.indexOf('video') === -1) {
    return res.status(400).json({ errors: 'file type errors, only access video' })
  }//ckeck the id
  const { id } = req.user
  let { mimetype, originalname } = req.file
  let videoDownloadPath = path.resolve(__dirname, '../../build/uploads/');
  let videoUserPath = path.join(videoDownloadPath, id.toString())
  let videoUserLocalPath = path.join(videoUserPath, 'local')
  if (!fs.existsSync(videoDownloadPath + '/' + id)) {
    console.log('folder not exist');
    fs.mkdirSync(videoDownloadPath + '/' + id, 0777);
  }
  if (!fs.existsSync(videoDownloadPath + '/' + id + '/local')) {
    console.log('not find, create folder...')
    //create folder
    fs.mkdirSync(videoDownloadPath + '/' + id + '/local', 0777);
  }
  if (mimetype === 'video/mp4') {
    console.log('find folder, upload file to s3')
    move(path.join(videoDownloadPath, originalname), path.join(videoUserLocalPath, originalname),
      () => {
        console.log('move files success');
        let videoUserLocalPathFile = path.join(videoUserLocalPath, originalname)
        readVideoBuffer(videoUserLocalPathFile, id, originalname, (obj) => {
          move(path.join(videoUserLocalPath, originalname), path.join(videoUserPath, originalname),
            () => { Video.create(obj).then(datas => { res.json(datas) }) }
          )
        })
      }
    )
  } else {
    // not video/mp4 file type
    console.log('file convert to mp4')
    let paths = originalname.split('.')[0]
    let newFileName = paths + '.mp4';
    let newFilePath = path.join(videoUserLocalPath, newFileName)
    let proc = new ffmpeg(req.file.path).toFormat('mp4').on('progress', function (info) {
      // console.log('progress ' + Math.floor(info.percent) + '%');
    }).on('end', function () {
      console.log('done processing input stream');
      fs.readFile(newFilePath, (err, fileBuffer) => {
        if (err) throw err;
        let times = Date.parse(new Date()).toString();
        let filename = md5(times).substring(0, 6)
        let paramsKey = filename + '.mp4';
        s3uploadFunc(paramsKey, fileBuffer, id, newFileName, filename, (obj) => {
          let oldFilePath = path.join(videoDownloadPath, req.file.originalname)
          fs.unlink(oldFilePath, () => {
            move(path.join(videoUserLocalPath, newFileName), path.join(videoUserPath, newFileName),
              () => { Video.create(obj).then(datas => { res.json(datas) }) })
          })
        })
      });
    })
      .on('error', function (err) { console.log('an error happened: ' + err.message); })
      .save(newFilePath)
  }
})

// @route   POST api/video/delete
// @desc    delete user video
// @access  private
//
router.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  let { video_path } = req.body;
  const { id } = req.user;
  let videoUserPath = path.join(path.resolve(__dirname, '../../build/uploads/'), id.toString())
  Video.findAll({ where: { video_path } }).then(datas => {
    if (datas.length === 0) {
      return res.status(400).json({ errors: 'no file' })
    } else {
      let obj = datas[0].dataValues
      Video.destroy({ where: { video_path } })
        .then(result => {
          if (result === 1) {
            let name = video_path + '.mp4'
            let params = { Bucket: 'appworks-stylish-1/project_2/video', Key: name }
            s3Client.deleteObject(params, function (err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else console.log(data);           // successful response
              fs.unlink(videoUserPath + '/' + obj.video_name, (err) => {
                if (err) {
                  console.log(err);
                  fs.unlink(videoUserPath + '/local/' + obj.video_name, (err) => {
                    return res.json({ msg: '刪除成功' })
                  })
                } else { return res.json({ msg: '刪除成功' }) }
              })
            });
          } else { res.status(400).json({ errors: '刪除失敗' }) }
        })
    }
  })
})

// @route   GET api/video/list
// @desc    show user video
// @access  private
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
  let select = { where: { user_id: req.user.id }, order: [['id', 'DESC']] }
  Video.findAll(select)
    .then(datas => {
      if (datas.length === 0) { return res.json([]) } else {
        let object = {};
        let obj = {};
        let arr = [];
        for (let i = 0; i < datas.length; i++) {
          let text = datas[i].video_path
          object[datas[i].video_path] = datas[i].dataValues
          arr.push(datas[i].dataValues)
        }
        res.json(arr);
      }
    })
})

// @route   POST api/video/plus
// @desc    add video views amount
// @access  Public
router.post('/plus', (req, res) => {
  const { video_path } = req.body;
  Video.findAll({ where: { video_path } })
    .then(datas => {
      let oldView = parseInt(datas[0].dataValues.views)
      let newView = oldView + 1
      Video.update({ views: newView }, { where: { video_path } })
        .then(result => {
          res.json({ video_path, views: newView })
        })
    })
})

// @route   GET api/video/alllist
// @desc    show all video
// @access  public
router.get('/alllist', (req, res) => {
  Video.findAll({ limit: 6, order: [['id', 'DESC']] })
    .then(datas => { res.json(datas); })
})

// @route   POST api/video/ytdl
// @desc    dl yt video
// @access  Private
router.post('/ytdl', passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = {};
  const { url } = req.body;
  if (url.indexOf('https://www.youtube.com/') === -1 &&
    url.indexOf('https://m.youtube.com/') === -1 &&
    url.indexOf('https://youtu.be/') === -1) {
    errors.input = 'this url invalid';
    return res.status(400).json(errors)
  }
  const { id } = req.user
  let videoUserPath = path.join(path.resolve(__dirname, '../../build/uploads/'), id.toString())
  let videoDownloadPath = path.resolve(__dirname, '../../build/uploads/');
  //check the floder exist
  if (!fs.existsSync(videoDownloadPath + '/' + id)) {
    console.log('folder not exist');
    fs.mkdirSync(videoDownloadPath + '/' + id, 0777);
  }
  console.log('folder exist');
  ytdlFunc(videoUserPath, url, id, (obj) => {
    Video.create(obj)
      .then(datas => { res.json(datas) })
  })
})

// @route   POST api/video/edit
// @desc    edit user video
// @access  private
router.post('/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.user
  let videoUserPath = path.join(path.resolve(__dirname, '../../build/uploads/'), id.toString())
  let videoDownloadTmpPath = path.resolve(__dirname, '../../build/uploads/tmp')
  const { start, end, video_path } = req.body;
  Video.findAll({ where: { video_path } })
    .then(datas => {
      let data = datas[0].dataValues
      let localfilename = data.video_name
      if (fs.existsSync(path.join(videoUserPath, localfilename))) {
        //find the local file
        console.log("File found");
        let duration = parseInt(end) - parseInt(start);
        let tmp = data.video_name;
        let proc = new ffmpeg(path.join(videoUserPath, localfilename))
          .seekInput(start)
          .duration(duration)
          .on('progress', function (info) {
            // console.log('progress ' + Math.floor(info.percent) + '%');
          })
          .on('end', function () {
            console.log('done processing input stream');
            fs.readFile(path.join(videoDownloadTmpPath, tmp), function (err, fileBuffer) {
              if (err) throw err;
              let paramsKey = data.video_path + '.mp4'
              s3uploadFunc(paramsKey, fileBuffer, null, localfilename, null, (obj) => {
                move(path.join(videoDownloadTmpPath, tmp), path.join(videoUserPath, localfilename),
                  (err) => {
                    if (err) { console.log({ error: "Error -> " + err }) };
                    res.json(datas[0].dataValues)
                  })
              })
            });
          })
          .on('error', function (err) { console.log('an error happened: ' + err.message); })
          .save(path.join(videoDownloadTmpPath, tmp))
      } else {
        return res.status(400).json({ error: 'error no local file to edit' })
      }
    })
})

module.exports = router;
