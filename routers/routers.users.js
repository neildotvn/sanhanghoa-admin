const express = require("express");
const { pool, adminPool } = require("../db/pool");
const _ = require("lodash");
const router = express.Router();

router.get("/", (req, res) => {
  pool.connect().then(client => {
    client
      .query("SELECT * FROM users")
      .then(data => {
        const users = data.rows.map(row => _.omit(row, ["password"]));
        // res.send(users)
        res.render("users/index", { users });
      })
      .catch(err => console.log(err))
      .finally(() => client.release());
  });
});

module.exports = router;
