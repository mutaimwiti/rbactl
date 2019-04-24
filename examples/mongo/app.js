const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

module.exports = app;
