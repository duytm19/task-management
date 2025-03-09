const express= require("express")
require("dotenv").config()
const database = require("./config/database")
const bodyParser = require("body-parser")

database.connect()
const app = express()
const port = 3000
const Router = require("./api/v1/routes/index.route")

// parse application/json
app.use(bodyParser.json())

Router(app)
app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
  });
  