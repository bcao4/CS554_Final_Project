const userRoutes = require("./AuthRoutes/users");
const cryptoDataRoutes = require("./crypto");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "build/" });
  });

  // crypto data
  app.use("/", cryptoDataRoutes);

  // user route
  app.use("/users", userRoutes);

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build/" });
  });
};
