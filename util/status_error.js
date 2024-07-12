
function StatusError(next,err,code){
  var error = new Error();
  error.msg = err;
  error.statusCode = code;
  next(error)
}


module.exports = StatusError;
