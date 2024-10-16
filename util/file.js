const fs = require("fs");

const DeleteFile = (filePath) =>{

  fs.unlink(filePath,(err)=>{

    if(err){
      console.log(err);
    }

  });

}


module.exports.DeleteFile = DeleteFile;
