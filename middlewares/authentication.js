require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

class AuthMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers.cookie.substring(6);
    if (!token) res.status(401).send("Token is empty");
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.status(401).send("Token is invalid!")
        } else {
            next()
        }
    })
  }

  static processToken(req) {
    const result = {};
    const token = req.headers.cookie.substring(6);
    if (!token) {
      result.status = 401;
      result.message = "Token is empty!";
      return result;
    }
  }

  static generateToken(user) {
    return jwt.sign(user, jwtSecret);
  }

  static verifyInputsNotNull(inputs) {
    for (key in inputs) {
      if (!inputs[key]) return false;
    }
    return true;
  }
}

module.exports = AuthMiddleware;
