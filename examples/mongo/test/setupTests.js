const { connect } = require('../app/config/database');

let connection;

beforeAll(async () => {
  connection = await connect();
});

afterAll(async () => {
  await connection.disconnect();
});
