import socketIOClient from "socket.io-client";
const WS_ENDPOINT =
  process.env?.NODE_ENV === "production"
    ? "https://cryptotracker-exchange.herokuapp.com"
    : "http://localhost:4000";

export const socket = socketIOClient(WS_ENDPOINT);
