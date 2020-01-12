const express = require("express");
const { pool } = require("../db/pool");
const router = express.Router();

router.get("/", (req, res) => {
  pool.connect().then(client => {
    client
      .query("SELECT * FROM notifications")
      .then(data => {
          res.send(data.rows);
        // res.render("users/index", { users });
      })
      .catch(err => console.log(err))
      .finally(() => client.release());
  });
});

module.exports = router;
