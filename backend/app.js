require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const serverSettings = require("./config/settings").server;
const { PORT } = serverSettings;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const checkAuth = require("./routes/AuthRoutes/checkAuthentication");
const configRoutes = require("./routes");
const configSocketIo = require("./routes/socket");

app.use("/users", checkAuth.checkAuthentication);
configSocketIo(io);
configRoutes(app);

server.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
