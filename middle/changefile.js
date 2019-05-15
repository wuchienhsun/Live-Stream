let fs = require('fs');

module.exports = move = (oldPath, newPath, callback) => {
  fs.rename(oldPath, newPath, (err) =>{
    if(err){
      if(err.code === 'EXDEV') {
        copy();
      } else {
        callback(err);
      }
      return;
    }
      callback();
  });

  copy = () => {
    let readStream = fs.createReadStream(oldPath);
    let writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', () => {
      fs.unlink(oldPath,callback)
    });

    readStream.pipe(writeStream);
  }
}