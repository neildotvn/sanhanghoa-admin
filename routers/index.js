const AuthMiddleware = require("../middlewares/authentication");

module.exports = app => {
    app.use("/auth", require("./routers.auth"));
    app.use("/users", [AuthMiddleware.authenticate], require("./routers.users"));
    app.use("/notifications", [AuthMiddleware.authenticate], require("./routers.notifications"));
};
