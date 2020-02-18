require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

class AuthMiddleware {
    static async authenticate(req, res, next) {
        let token = "";
        try {
            token = req.headers.cookie
            .split(" ")
            .filter(str => str.substring(0, 5) === "token")[0]
            .substring(6);
        } catch (err) {
            console.log(err)
        }
        if (!token) res.status(401).redirect("/auth/login");
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).redirect("/auth/login");
            } else {
                next();
            }
        });
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
