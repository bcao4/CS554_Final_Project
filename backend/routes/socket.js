const { getPrice } = require("../data/api.js");

module.exports = (io) => {
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
};
