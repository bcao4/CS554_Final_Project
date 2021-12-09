require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const checkAuth = require("./routes/AuthRoutes/checkAuthentication");
app.use("/users", checkAuth.checkAuthentication);
//
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const configRoutes = require("./routes");
const configSocketIo = require("./socket");

const PORT = 4000;

configSocketIo(io);
configRoutes(app);

server.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
