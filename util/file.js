var fs = require("fs");

const DeleteFile = (filePath) =>{
  fs.unlink(filePath,(err)=>{
    if(err){
      donsole.log(err);
    }
  });
}



module.exports = DeleteFile;
