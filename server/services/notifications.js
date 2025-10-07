import { v4 as uuidv4 } from "uuid";

export function sendNotification(io) {
    return (req, res) => {
        try {
            const { type, data, socketId } = req.body;

            if (!type || !data) {
                return res.status(400).json({ message: "Missing type or data" });
            }

            const notification = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                message: `Mesaj nou de la ${data.from}: '${data.text}'`,
            };

            // Exclude sender if we know their socketId
            if (socketId && io.sockets.sockets.get(socketId)) {
                io.sockets.sockets
                    .get(socketId)
                    .broadcast.emit("new_notification", notification);
            } else {
                io.emit("new_notification", notification);
            }

            res.status(200).json({ status: "ok", notification });
        } catch (error) {
            console.error("Error sending notification:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}
