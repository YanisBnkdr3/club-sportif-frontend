import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Connexion WebSocket

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connexion WebSocket
    socket.emit("userConnected", userId);

    // Écouter les nouvelles notifications
    socket.on("receiveNotification", (message) => {
      setNotifications((prev) => [...prev, { message, read: false }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    // Récupérer les notifications depuis l'API
    axios
      .get(`http://localhost:5000/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Erreur notifications :", err));
  }, [userId]);

  return (
    <div className="relative">
      <button className="relative p-2 bg-blue-500 text-white rounded">
        🔔{" "}
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>
      <div className="absolute bg-white shadow-md mt-2 w-64 p-3">
        {notifications.length === 0 ? (
          <p>Aucune notification</p>
        ) : (
          notifications.map((n, index) => (
            <p key={index} className="text-sm p-2 border-b">
              {n.message}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
