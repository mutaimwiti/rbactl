const app = require('./src');
const { connect } = require('./src/config/database');

connect(() => {
  app.listen(3000, () => {
    /* eslint-disable-next-line */
    console.log('Server is listening on port 3000');
  });
});
