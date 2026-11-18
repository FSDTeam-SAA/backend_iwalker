import http from "http";
import { Server } from "socket.io";
import { port } from "./src/config/config";
import configDb from "./src/dbConfig/configDb";
import app from "./src/app";
import { registerSocketEvents } from "./src/socket/socket";
import 'dotenv/config';

// connect db
configDb();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocketEvents(io);

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
