import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erreur lors de l'inscription");

      setSuccess("✅ Inscription réussie ! Redirection...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 flex items-center justify-center p-6">
      <div className="backdrop-blur-lg bg-white bg-opacity-20 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          📝 Inscription
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center bg-white bg-opacity-30 rounded-xl p-4 shadow">
            <FaUser className="text-white text-xl mr-4" />
            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              className="bg-transparent text-white w-full outline-none"
              required
            />
          </div>

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
            S'inscrire
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
