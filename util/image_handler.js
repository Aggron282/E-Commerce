var path = require("path");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;

  if(!file.originalname){
    return cb(null, false);
    return;
  }
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }else {
    return cb(null, false);
  }

}

module.exports.checkFileType = checkFileType;
