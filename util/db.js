// var mongodb = require("mongodb").MongoClient;
// var db_;
// var url = "mongodb+srv://mawile12:sableye12@cluster0.mv38jgm.mongodb.net/shop?retryWrites=true&w=majority"
//
// const Connect = (cb) =>{
//   mongodb.connect(url).then((client)=>{
//     db_ = client.db();
//     cb(db_);
//   })
// }
//
// const GetDB = () => {
//   if(db_){
//     return db_;
//   }else{
//     return null;
//   }
// }
//
//
// module.exports.GetDB = GetDB;
// module.exports.Connect = Connect;
