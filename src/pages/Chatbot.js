import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRobot,
  FaPaperPlane,
  FaMoon,
  FaSun,
  FaTrash,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const senderId = currentUser?.id;

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const fetchDiscussions = async () => {
      const res = await axios.get(`http://localhost:5000/chatbot/sessions`);
      setDiscussions(res.data);
    };
    if (senderId) fetchDiscussions();
  }, [senderId]);

  const selectDiscussion = async (discussion) => {
    setSelectedDiscussion(discussion);
    const res = await axios.get(
      `http://localhost:5000/chatbot/history/${discussion._id}`
    );
    setMessages(res.data.map((m) => ({ from: m.sender, text: m.text })));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await axios.post("http://localhost:5000/chatbot/message", {
      senderId,
      sessionId: selectedDiscussion._id,
      message: input,
    });

    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      ...res.data.replies.map((text) => ({ from: "bot", text })),
    ]);
    setInput("");
  };

  const createDiscussion = async () => {
    const res = await axios.post("http://localhost:5000/chatbot/new-session");
    setDiscussions((prev) => [res.data, ...prev]);
  };

  // ✅ Correction de la fonction renameDiscussion
  const renameDiscussion = async (id) => {
    const title = prompt("Nouveau titre ?");
    if (title?.trim()) {
      await axios.put(`http://localhost:5000/chatbot/rename-session/${id}`, {
        title,
      });
      setDiscussions((prev) =>
        prev.map((d) => (d._id === id ? { ...d, title } : d))
      );
    }
  };

  // ✅ Correction de la fonction deleteDiscussion
  const deleteDiscussion = async (id) => {
    if (window.confirm("Supprimer cette discussion ?")) {
      await axios.delete(`http://localhost:5000/chatbot/delete-session/${id}`);
      setDiscussions((prev) => prev.filter((d) => d._id !== id));
      if (selectedDiscussion?._id === id) {
        setSelectedDiscussion(null);
        setMessages([]);
      }
    }
  };

  return (
    <div
      className={`$${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } h-screen flex`}
    >
      {/* Sidebar */}
      <div
        className={`w-1/4 p-4 $${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">💬 Discussions</h2>
          <button
            onClick={createDiscussion}
            className="text-green-400 hover:text-green-500"
          >
            <FaPlus />
          </button>
        </div>
        {discussions.map((d) => (
          <div
            key={d._id}
            className={`p-2 rounded-lg cursor-pointer flex justify-between items-center $${
              selectedDiscussion?._id === d._id
                ? "bg-blue-300 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => selectDiscussion(d)}
          >
            <span>{d.title || `Session ${d._id.substring(0, 4)}`}</span>
            <div className="flex gap-2 ml-2">
              <FaEdit
                onClick={(e) => {
                  e.stopPropagation();
                  renameDiscussion(d._id);
                }}
                className="cursor-pointer text-yellow-500"
              />
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDiscussion(d._id);
                }}
                className="cursor-pointer text-red-500"
              />
            </div>
          </div>
        ))}
        <div className="mt-6">
          <button
            onClick={toggleDarkMode}
            className="text-sm flex items-center gap-2"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaRobot /> Assistant IA
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 max-w-xs rounded-xl shadow $${
                msg.from === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-300"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (selectedDiscussion) {
                  sendMessage();
                } else {
                  alert(
                    "Veuillez sélectionner une discussion ou en créer une."
                  );
                }
              }
            }}
            className="flex-1 p-3 rounded-l-xl border"
            placeholder="Posez une question..."
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 rounded-r-xl"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
