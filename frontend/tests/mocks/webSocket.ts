import { ws } from "msw";

const api = ws.link("/socket.io/");

export const handlers = [
   api.addEventListener("connection", () => {
      console.log("WebSocket client connecting...");
   }),
];
