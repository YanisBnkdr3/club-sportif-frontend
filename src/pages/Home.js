import { Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 flex flex-col items-center justify-center text-white px-6">
      <div className="text-center max-w-3xl backdrop-blur-xl bg-white bg-opacity-20 p-10 rounded-3xl shadow-2xl animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Bienvenue sur{" "}
          <span className="text-yellow-300">Gestion des Clubs Sportifs</span>
        </h1>

        <p className="text-lg mb-8">
          Une plateforme moderne et sécurisée pour gérer vos clubs,
          entraînements et paiements, avec un{" "}
          <span className="font-semibold">chatbot intelligent</span> intégré
          pour vous assister.
        </p>

        <div className="space-x-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <FaUserPlus /> S'inscrire
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-800 transition-all duration-300"
          >
            <FaSignInAlt /> Se connecter
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <div className="overflow-hidden rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"></div>
      </div>
    </div>
  );
}

export default Home;
