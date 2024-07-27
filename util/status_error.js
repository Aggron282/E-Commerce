
function StatusError(next,err,code){

  var error = new Error();

  error.msg = err;
  error.statusCode = code;

  next(error)

}

const secret = "sk_test_51OjAfEL9aEOLpUqjCLjitVLvOalLj9CCZEpk9SPkxZnmh2xJZSsB8Fp8mrkAO8lNUaogi51OVptQ9Tc56el67Skg008Rlc9dP2";
module.exports = StatusError;
