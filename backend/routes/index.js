const userRoutes = require("./AuthRoutes/users");
const cryptoDataRoutes = require("./crypto");
const photoRoutes = require('./AuthRoutes/imageUpload');

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "build/" });
  });

  // crypto data
  app.use("/", cryptoDataRoutes);

  // user route
  app.use("/users", userRoutes);

  //image route
  app.use('/photo', photoRoutes);

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build/" });
  });
};
