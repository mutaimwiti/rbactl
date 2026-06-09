const mongoose = require('mongoose');
const { config } = require('./config');

// Mongoose 6+ no longer needs useNewUrlParser/useUnifiedTopology/useFindAndModify
// and no longer accepts a callback - connect/disconnect return promises. The
// optional callback is kept for the seeder/server scripts that pass one, by
// running it once the promise resolves.
const connect = (callback = null) => {
  const promise = mongoose.connect(config.mongoUrl);
  return callback ? promise.then(callback) : promise;
};

const disconnect = (callback = null) => {
  const promise = mongoose.disconnect();
  return callback ? promise.then(callback) : promise;
};

module.exports = { connect, disconnect };
