const mongoose = require('mongoose');
const { config } = require('./config');

const options = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useFindAndModify: false,
};

const connect = (callback = null) => {
  return mongoose.connect(config.mongoUrl, options, callback);
};

const disconnect = (callback = null) => {
  return mongoose.disconnect(callback);
};

module.exports = { connect, disconnect };
