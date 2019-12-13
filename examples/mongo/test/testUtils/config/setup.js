const { connect } = require('../../../src/config/database');

let connection;

beforeAll(async () => {
  connection = await connect();
});

afterAll(async () => {
  await connection.disconnect();
});
