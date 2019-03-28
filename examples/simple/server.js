const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app);

app.listen(3000, () => {
  /* eslint-disable-next-line */
  console.log("Server is listening on port 3000");
});
