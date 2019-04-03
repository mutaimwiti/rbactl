const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

module.exports = app;
