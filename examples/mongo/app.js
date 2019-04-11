const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes");
const { connect } = require("./app/config/database");

(async () => {
  await connect();
})();

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

module.exports = app;
