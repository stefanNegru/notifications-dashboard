import { useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [from, setFrom] = useState("");
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const handleConnect = () => {
    if (!connected) {
      // Create socket connection
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        console.log("Connected to server(F):", socketRef.current.id);
        setConnected(true);
      });

      socketRef.current.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server(F)");
        setConnected(false);
      });
    } else {
      // Unsubscribe / Disconnect
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }
  };

  // Send POST request to backend to trigger notification
  const handleSend = async () => {
    if (!from || !text) return;

    await fetch("http://localhost:3000/api/trigger-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "NEW_MESSAGE",
        data: { from, text },
        socketId: socketRef.current.id,
      }),
    });

    setText("");
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Real-time Notifications</h1>

      <button onClick={handleConnect}>
        {connected ? "Disconnect" : "Connect"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend} disabled={!connected}>
          Send Notification
        </button>
      </div>

      <h2>Notifications:</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            [{n.timestamp}] {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
