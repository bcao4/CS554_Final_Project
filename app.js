const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
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
const { getPrice } = require("./api.js");
const configRoutes = require("./routes");
const PORT = 4000;

io.on("connection", (socket) => {
  console.log("websocket user connected");
  socket.on("request price", async (args) => {
    const coin = args.coin;
    try {
      console.log(`requesting price for ${coin}`);
      const price = await getPrice(coin);
      socket.emit("price update", price);
    } catch (e) {
      // 429 = rate limited
      console.error(`Error fetching last price for ${coin}: ${e.message}`);
    }
  });
  socket.on("disconnect", () => {
    console.log("websocket user disconnected");
  });
});

configRoutes(app);

server.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});
