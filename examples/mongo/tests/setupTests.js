const { connect, disconnect } = require('../app/config/database');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});
