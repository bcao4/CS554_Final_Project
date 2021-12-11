const userRoutes = require("./AuthRoutes/users");
const cryptoDataRoutes = require("./crypto");

module.exports = (app) => {
  app.get("/", (req, res) => {
    // TODO: send react app from build folder - for deployment
    res.send("test");
  });

  // crypto data
  app.use("/", cryptoDataRoutes);

  // user route
  app.use("/users", userRoutes);
};
