import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";
import { FaUsers, FaDumbbell, FaMoneyBillWave } from "react-icons/fa";
import Chart from "react-apexcharts";

function AdminStatistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des statistiques", error);
    }
  };

  if (!stats) {
    return (
      <p className="text-center mt-10 text-white text-xl animate-pulse">
        Chargement des statistiques...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 p-8 text-white">
      <h2 className="text-5xl font-extrabold text-center mb-12 animate-fade-in">
        📊 Statistiques Admin
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center hover:scale-105 transition duration-300">
          <FaUsers className="text-blue-300 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Total Membres</h3>
          <p className="text-4xl font-extrabold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center hover:scale-105 transition duration-300">
          <FaDumbbell className="text-green-300 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Total Entraînements</h3>
          <p className="text-4xl font-extrabold">{stats.totalTrainings}</p>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center hover:scale-105 transition duration-300">
          <FaMoneyBillWave className="text-yellow-300 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Total Paiements</h3>
          <p className="text-4xl font-extrabold">{stats.totalPayments}</p>
        </div>
      </div>

      {/* 📈 Activité des Entraînements */}
      <div className="mt-16 bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-bold text-center mb-8">
          📈 Activité des Entraînements
        </h3>
        {stats.trainingActivity.length > 0 ? (
          <Chart
            options={{
              chart: { id: "trainings-chart", toolbar: { show: false } },
              xaxis: { categories: stats.trainingActivity.map((t) => t.date) },
              colors: ["#34D399"],
              stroke: { curve: "smooth" },
            }}
            series={[
              {
                name: "Inscriptions",
                data: stats.trainingActivity.map((t) => t.count),
              },
            ]}
            type="line"
            height={350}
          />
        ) : (
          <p className="text-center text-white text-opacity-80">
            Pas d'activité d'entraînement.
          </p>
        )}
      </div>

      {/* 💰 Revenus des Paiements */}
      <div className="mt-12 bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-bold text-center mb-8">
          💰 Revenus des Paiements
        </h3>
        {stats.paymentActivity.length > 0 ? (
          <Chart
            options={{
              chart: { id: "payments-chart", toolbar: { show: false } },
              xaxis: { categories: stats.paymentActivity.map((p) => p.date) },
              colors: ["#FBBF24"],
            }}
            series={[
              {
                name: "Revenus (€)",
                data: stats.paymentActivity.map((p) => p.amount),
              },
            ]}
            type="bar"
            height={350}
          />
        ) : (
          <p className="text-center text-white text-opacity-80">
            Aucune donnée de paiement.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminStatistics;
