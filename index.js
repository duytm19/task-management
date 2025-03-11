const express= require("express")
require("dotenv").config()
const database = require("./config/database")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
database.connect()
const app = express()
const port = 3000
const Router = require("./api/v1/routes/index.route")
app.use(cors())

app.use(cookieParser())
// parse application/json
app.use(bodyParser.json())

Router(app)
app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
  });
  