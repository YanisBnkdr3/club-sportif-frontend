import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trainings from "./pages/Trainings";
import Payments from "./pages/Payments";
import Statistics from "./pages/Statistics";
import Chatbot from "./pages/Chatbot";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStatistics from "./pages/AdminStatistics";
import Notifications from "./pages/Notifications";
import { isAuthenticated, isAdmin, logout } from "./utils/auth";

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderUserNavbar = () => (
    <nav className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex justify-between items-center shadow-lg">
      <div className="space-x-6 font-semibold">
        <Link className="hover:underline" to="/">
          Accueil
        </Link>
        <Link className="hover:underline" to="/dashboard">
          Dashboard
        </Link>
        <Link className="hover:underline" to="/trainings">
          Entraînements
        </Link>
        <Link className="hover:underline" to="/payments">
          Paiements
        </Link>
        <Link className="hover:underline" to="/statistics">
          Messagerie
        </Link>
        <Link className="hover:underline" to="/chatbot">
          Chatbot
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-2 rounded-full shadow hover:bg-red-700 transition"
      >
        Déconnexion
      </button>
    </nav>
  );

  const renderAdminNavbar = () => (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
      <div className="space-x-6 font-semibold">
        <Link className="hover:underline" to="/">
          Accueil
        </Link>
        <Link className="hover:underline" to="/dashboard">
          Dashboard
        </Link>
        <Link className="hover:text-yellow-400" to="/admin-dashboard">
          Admin Dashboard
        </Link>
        <Link className="hover:text-purple-400" to="/admin-statistics">
          Admin Stats
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-2 rounded-full shadow hover:bg-red-700 transition"
      >
        Déconnexion
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar dynamique */}
      {isAuthenticated() &&
        (isAdmin() ? renderAdminNavbar() : renderUserNavbar())}

      <div className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Utilisateur Auth */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/trainings"
            element={
              isAuthenticated() && !isAdmin() ? (
                <Trainings />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/payments"
            element={
              isAuthenticated() && !isAdmin() ? (
                <Payments />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/statistics"
            element={
              isAuthenticated() && !isAdmin() ? (
                <Statistics />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/chatbot"
            element={
              isAuthenticated() && !isAdmin() ? (
                <Chatbot />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated() ? <Notifications /> : <Navigate to="/login" />
            }
          />

          {/* Admin Only */}
          <Route
            path="/admin-dashboard"
            element={
              isAuthenticated() && isAdmin() ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin-statistics"
            element={
              isAuthenticated() && isAdmin() ? (
                <AdminStatistics />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
