const mongoose = require('mongoose');
const { connect, disconnect } = require('../../../app/config/database');

module.exports = async () => {
  await connect();
  await mongoose.connection.dropDatabase();
  await disconnect();
};
