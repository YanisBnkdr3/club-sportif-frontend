// ✅ Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});

  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data.filter((u) => u._id !== currentUser.id));
      } catch (err) {
        console.error("❌ Erreur chargement utilisateurs", err);
      }
    };

    if (currentUser?.id) {
      socket.emit("userConnected", currentUser.id);
      fetchUsers();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    socket.on("updateOnlineUsers", (onlineMap) => {
      setOnlineUsers(onlineMap);
    });
    return () => socket.off("updateOnlineUsers");
  }, []);

  const loadConversation = async (userId) => {
    setSelectedUser(userId);
    const res = await axios.get(
      `http://localhost:5000/chat/history/${currentUser.id}/${userId}`
    );
    setMessages(res.data);
    socket.emit("markAsRead", { from: userId, to: currentUser.id });
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.sender === selectedUser || msg.receiver === selectedUser) {
        setMessages((prev) => [...prev, msg]);
        socket.emit("markAsRead", {
          from: msg.sender,
          to: currentUser.id,
        });
      }
    });

    socket.on("messagesRead", ({ readerId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiver === readerId ? { ...msg, read: true } : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesRead");
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (!input || !selectedUser) return;
    const msg = {
      sender: currentUser.id,
      receiver: selectedUser,
      content: input,
    };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [
      ...prev,
      { ...msg, timestamp: new Date(), read: false },
    ]);
    setInput("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">👥 Membres</h2>
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => loadConversation(u._id)}
            className={`cursor-pointer p-2 rounded-lg mb-2 hover:bg-purple-600 ${
              selectedUser === u._id ? "bg-purple-700" : ""
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-2">
              <img
                src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${u.name}`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{u.name}</span>
            </div>
            <span
              className={`text-xs ml-2 font-bold ${
                onlineUsers[u._id] ? "text-green-400" : "text-red-400"
              }`}
            >
              {onlineUsers[u._id] ? "🟢" : "🔴"}
            </span>
          </div>
        ))}
      </div>

      <div className="w-3/4 p-6 bg-gray-100 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-xs rounded-xl p-3 shadow text-sm ${
                    msg.sender === currentUser.id
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-white text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">
                      {msg.sender === currentUser.id ? "Moi" : "Lui/Elle"}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div>{msg.content}</div>
                  {msg.sender === currentUser.id && msg.read && (
                    <div className="text-right text-[10px] text-green-500 mt-1">
                      ✔ Lu
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 p-3 rounded-l-xl border"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 rounded-r-xl"
              >
                Envoyer
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
            Sélectionnez un utilisateur pour démarrer la conversation.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
