import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUserTie, FaUsers } from "react-icons/fa";

function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    cleanupExpiredTrainings(); // 🔥 Supprime les anciens entraînements de la base
    fetchTrainings(); // 📦 Récupère les entraînements à jour
  }, []);

  const fetchTrainings = async () => {
    const res = await fetch("http://localhost:5000/trainings");
    const data = await res.json();
    setTrainings(data);
  };

  const cleanupExpiredTrainings = async () => {
    try {
      await fetch("http://localhost:5000/trainings/cleanup/expired", {
        method: "DELETE",
      });
      console.log("✅ Entraînements expirés supprimés");
    } catch (error) {
      console.error(
        "❌ Erreur de suppression des entraînements expirés",
        error
      );
    }
  };

  const handleRegister = async (trainingId) => {
    const res = await fetch(
      `http://localhost:5000/trainings/${trainingId}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      }
    );
    if (res.ok) fetchTrainings();
  };

  const handleUnregister = async (trainingId) => {
    const res = await fetch(
      `http://localhost:5000/trainings/${trainingId}/unregister`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      }
    );
    if (res.ok) fetchTrainings();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-8 text-white">
      <h2 className="text-4xl font-extrabold text-center mb-12 animate-pulse">
        📅 Gestion des Entraînements
      </h2>

      {/* 🔍 Barre de recherche par date stylée */}
      <div className="mb-12 text-center">
        <label
          htmlFor="dateSearch"
          className="block text-lg font-semibold mb-3"
        >
          🔍 Rechercher les entraînements par date :
        </label>
        <input
          id="dateSearch"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 w-72 rounded-2xl shadow-lg text-center bg-white text-gray-800 font-semibold border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {trainings
          .filter((training) => {
            const trainingDateTime = new Date(
              `${training.date}T${training.time}`
            );
            const now = new Date();

            if (trainingDateTime < now) return false;
            if (selectedDate && training.date !== selectedDate) return false;

            return true;
          })
          .map((training) => (
            <div
              key={training._id}
              className="backdrop-blur-sm bg-white bg-opacity-20 rounded-3xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold mb-4">{training.name}</h3>
              <p className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-yellow-300" />{" "}
                {training.location}
              </p>
              <p className="text-lg mb-2">
                🗓️ {training.date} à 🕒 {training.time}
              </p>
              <p className="flex items-center text-lg mb-4">
                <FaUserTie className="mr-2 text-green-300" /> Coach :{" "}
                {training.coach}
              </p>

              <div className="flex items-center mb-4">
                <FaUsers className="mr-2 text-indigo-300" />
                <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm">
                  Participants : {training.participants.length}
                </span>
              </div>

              {training.participants.includes(user.id) ? (
                <button
                  onClick={() => handleUnregister(training._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-full font-semibold shadow-lg transition duration-300"
                >
                  ❌ Se désinscrire
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(training._id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-full font-semibold shadow-lg transition duration-300"
                >
                  ✅ S'inscrire
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Trainings;
