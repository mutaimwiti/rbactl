const app = require('./app');
const { connect } = require('./app/config/database');

(async () => {
  await connect();
})();

app.listen(3000, () => {
  /* eslint-disable-next-line */
  console.log("Server is listening on port 3000");
});
