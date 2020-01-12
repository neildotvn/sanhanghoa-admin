require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// const saltRounds = 10;

// const bcryptHash = password =>
//   bcrypt.genSalt(saltRounds).then(salt => {
//     return bcrypt.hash(password, salt);
//   });

// bcryptHash("tvtgialai!@#")
//   .then(pass => {
//     console.log(pass);
//     const isMatch = bcrypt.compareSync("tvtgialai!@#", pass);
//     console.log(isMatch);
//   })
//   .catch(err => console.log(err));

console.log(__dirname);
