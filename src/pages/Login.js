import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { saveUserSession } from "../utils/auth";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Erreur lors de la connexion");

      saveUserSession(data.token, data.user);
      setSuccess("✅ Connexion réussie ! Redirection...");
      setTimeout(() => {
        data.user.role === "admin"
          ? navigate("/admin-dashboard")
          : navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 flex items-center justify-center p-6">
      <div className="backdrop-blur-lg bg-white bg-opacity-20 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          🔐 Connexion
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center bg-white bg-opacity-30 rounded-xl p-4 shadow">
            <FaEnvelope className="text-white text-xl mr-4" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-white w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center bg-white bg-opacity-30 rounded-xl p-4 shadow">
            <FaLock className="text-white text-xl mr-4" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-white w-full outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold transition duration-300 shadow-lg"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Inscription
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
