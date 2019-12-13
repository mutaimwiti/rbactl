const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../../.env` });

const env = process.env.NODE_ENV || 'development';

const allConfig = {
  development: {
    mongoUrl: process.env.DB_URL,
  },
  test: {
    mongoUrl: process.env.TEST_DB_URL,
  },
};

const config = allConfig[env];

module.exports = { config, env };
