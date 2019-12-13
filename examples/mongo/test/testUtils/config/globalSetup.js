const mongoose = require('mongoose');
const { connect, disconnect } = require('../../../src/config/database');

module.exports = async () => {
  await connect();
  await mongoose.connection.dropDatabase();
  await disconnect();
};
