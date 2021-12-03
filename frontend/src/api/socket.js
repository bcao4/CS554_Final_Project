import socketIOClient from "socket.io-client";
const WS_ENDPOINT = "localhost:4000";

export const socket = socketIOClient(WS_ENDPOINT);
