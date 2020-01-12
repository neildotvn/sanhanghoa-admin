require("dotenv").config();
const express = require("express");
const { adminPool } = require("../db/pool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login", { data: "nothing" });
});

router.post("/login", (req, res) => {
  // res.send(req.body);
  adminPool.connect().then(client => {
    client
      .query({
        text: "SELECT * FROM users WHERE username=$1",
        values: [req.body.username]
      })
      .then(data => {
        bcrypt
          .compare(req.body.password, data.rows[0].password)
          .then(isMatch => {
            console.log(isMatch);
            if (isMatch) {
              const token = jwt.sign({}, process.env.JWT_SECRET);
              res.cookie("token", token);
              res.render("main/index", {
                token
              });
            } else res.status(401).send("Wrong credentials");
          })
          .catch(err => {
            res.status(401).send("Wrong credentials");
          });
      })
      .catch(err => res.status(500).send(err))
      .finally(() => client.release());
  });
});

module.exports = router;
