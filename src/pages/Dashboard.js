import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import {
  FaUserCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaDumbbell,
  FaBell,
  FaTrash,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const clearPayments = async () => {
    try {
      await fetch(`http://localhost:5000/payments/clear/${user.id}`, {
        method: "DELETE",
      });
      setPayments([]);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des paiements :", error);
    }
  };

  const clearNotifications = async () => {
    try {
      await fetch(`http://localhost:5000/notifications/clear/${user.id}`, {
        method: "DELETE",
      });
      setNotifications([]);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la suppression des notifications :",
        error
      );
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const paymentsRes = await fetch(
        `http://localhost:5000/payments/${userId}`
      );
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData.slice(0, 3));

      const trainingsRes = await fetch(
        `http://localhost:5000/trainings/user/${userId}`
      );
      const trainingsData = await trainingsRes.json();
      setTrainings(trainingsData.slice(0, 3));

      const notificationsRes = await fetch(
        `http://localhost:5000/notifications/${userId}`
      );
      const notificationsData = await notificationsRes.json();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("❌ Erreur de récupération des données :", error);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!isAuthenticated() || !storedUser) {
      navigate("/login");
      logout();
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser.id);
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchUserData(user.id);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white transition-all duration-700">
      <div className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl w-[450px] hover:scale-105 transform transition duration-500">
        <h2 className="text-4xl font-extrabold text-center text-indigo-600 mb-8 animate-pulse">
          🎯 Tableau de Bord
        </h2>

        {user ? (
          <div className="flex flex-col items-center space-y-6">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=150`}
              alt="Avatar Généré"
              className="w-28 h-28 rounded-full shadow-lg border-4 border-indigo-500 object-cover"
            />

            <p className="text-2xl font-semibold flex items-center">
              <FaUserCircle className="mr-3 text-indigo-600" /> {user.name}
            </p>
            <p className="text-gray-600 text-lg flex items-center">
              <FaEnvelope className="mr-3 text-gray-500" /> {user.email}
            </p>

            {/* Notifications */}
            <div className="w-full bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-yellow-700 flex justify-between items-center">
                <span className="flex items-center">
                  <FaBell className="mr-2" /> Notifications
                </span>
                <button
                  onClick={clearNotifications}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </h3>
              {notifications.length > 0 ? (
                <ul className="mt-4 space-y-2 text-gray-800">
                  {notifications.map((notif, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-lg shadow hover:bg-yellow-50 transition"
                    >
                      📢 {notif.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mt-4">
                  Aucune notification.
                </p>
              )}
            </div>

            {/* Paiements */}
            <div className="w-full bg-gradient-to-r from-green-100 via-green-200 to-green-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-green-700 flex justify-between items-center">
                <span className="flex items-center">
                  <FaMoneyBillWave className="mr-2" /> Paiements récents
                </span>
                <button
                  onClick={clearPayments}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </h3>
              {payments.length > 0 ? (
                <ul className="mt-4 space-y-2 text-gray-800">
                  {payments.map((payment) => (
                    <li
                      key={payment._id}
                      className="bg-white p-3 rounded-lg shadow hover:bg-green-50 transition"
                    >
                      💰 <strong>{payment.amount} €</strong> -{" "}
                      {new Date(payment.date).toLocaleDateString()}
                      <span
                        className={`ml-3 font-semibold ${
                          payment.status === "Effectué"
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mt-4">
                  Aucun paiement enregistré.
                </p>
              )}
            </div>

            {/* Entraînements */}
            <div className="w-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center">
                <FaDumbbell className="mr-2" /> Mes Entraînements
              </h3>
              {trainings.length > 0 ? (
                <ul className="mt-4 space-y-2 text-gray-800">
                  {trainings.map((training) => (
                    <li
                      key={training._id}
                      className="bg-white p-3 rounded-lg shadow hover:bg-purple-50 transition"
                    >
                      🏋️ <strong>{training.name}</strong> - {training.date} à{" "}
                      {training.time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mt-4">
                  Aucun entraînement enregistré.
                </p>
              )}
            </div>

            {/* Déconnexion */}
            <button
              onClick={logout}
              className="mt-6 bg-red-500 flex items-center justify-center gap-3 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-red-600 transition duration-300"
            >
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 animate-pulse text-lg">
            Chargement des informations...
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
