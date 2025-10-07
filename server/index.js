import express from "express";
import cors from "cors";
import { sendNotification } from "./services/notifications.js";
import { app, server, io } from "./services/socket.js"

//const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/trigger-event", sendNotification(io))

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
