const express = require("express");
const bodyParser = require("body-parser");
const AuthMiddleware = require("./middlewares/authentication");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./routers/index")(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}!`));
