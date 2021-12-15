require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

const PORT = process.env?.PORT ?? 4000;

app.use(express.json());
app.use(express.urlencoded());

let socketCorsConfig = {};

if (process.env?.NODE_ENV !== "production") {
  // enable cors for local testing
  socketCorsConfig = {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  };
  app.use(cors());
}

const server = http.createServer(app);
const io = require("socket.io")(server, socketCorsConfig);

app.use(express.static("build"));

const checkAuth = require("./routes/AuthRoutes/checkAuthentication");
const configRoutes = require("./routes");
const configSocketIo = require("./routes/socket");

app.use("/users", checkAuth.checkAuthentication);
configSocketIo(io);
configRoutes(app);

server.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
