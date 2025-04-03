import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";
import { FaChartBar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [editingTraining, setEditingTraining] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    coach: "",
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchTrainings();
  }, [navigate]);

  const fetchTrainings = async () => {
    try {
      const res = await fetch("http://localhost:5000/trainings");
      const data = await res.json();
      setTrainings(data);
    } catch (error) {
      console.error("❌ Erreur chargement entraînements", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateTraining = async (e) => {
    e.preventDefault();
    const method = editingTraining ? "PUT" : "POST";
    const url = editingTraining
      ? `http://localhost:5000/trainings/${editingTraining}`
      : "http://localhost:5000/trainings";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRole: "admin" }),
      });

      if (res.ok) {
        fetchTrainings();
        setFormData({ name: "", date: "", time: "", location: "", coach: "" });
        setEditingTraining(null);
      } else {
        const errorData = await res.json();
        alert("Erreur : " + errorData.message);
      }
    } catch (error) {
      console.error("❌ Erreur traitement entraînement", error);
    }
  };

  const handleEditTraining = (training) => {
    setEditingTraining(training._id);
    setFormData(training);
  };

  const handleDeleteTraining = async (id) => {
    if (!window.confirm("Confirmez la suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/trainings/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: "admin" }),
      });
      if (res.ok) fetchTrainings();
      else alert("Erreur suppression.");
    } catch (error) {
      console.error("❌ Erreur suppression", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        🛠 Tableau de Bord Admin
      </h2>

      <div className="text-center mb-8">
        <Link
          to="/admin-statistics"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-full font-bold transition duration-300"
        >
          <FaChartBar /> Voir les Statistiques
        </Link>
      </div>

      <div className="max-w-xl mx-auto bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-center">
          {editingTraining
            ? "✏️ Modifier l'Entraînement"
            : "➕ Ajouter un Entraînement"}
        </h3>
        <form onSubmit={handleAddOrUpdateTraining} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-4 rounded-xl shadow bg-white bg-opacity-60 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-4 rounded-xl shadow bg-white bg-opacity-60 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="w-full p-4 rounded-xl shadow bg-white bg-opacity-60 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full p-4 rounded-xl shadow bg-white bg-opacity-60 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="coach"
            placeholder="Coach"
            value={formData.coach}
            onChange={handleInputChange}
            required
            className="w-full p-4 rounded-xl shadow bg-white bg-opacity-60 focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold transition duration-300"
          >
            {editingTraining ? "Mettre à Jour" : "Ajouter"}
          </button>
        </form>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-6">
          📅 Liste des Entraînements
        </h3>
        {trainings.length === 0 ? (
          <p className="text-center text-white text-opacity-80">
            Aucun entraînement disponible.
          </p>
        ) : (
          <ul className="max-w-3xl mx-auto space-y-6">
            {trainings.map((training) => (
              <li
                key={training._id}
                className="p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-lg flex justify-between items-center hover:scale-105 transition duration-300"
              >
                <div>
                  <p className="text-xl font-bold">{training.name}</p>
                  <p className="mt-2">
                    {training.date} à {training.time} - {training.location}
                  </p>
                  <p className="text-sm text-white text-opacity-80">
                    Coach : {training.coach}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditTraining(training)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTraining(training._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
