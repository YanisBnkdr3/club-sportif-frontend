import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { FaLock, FaCheckCircle } from "react-icons/fa";

const stripePromise = loadStripe(
  "pk_test_51Qyim0FTCq5swLE4dhnX3e4ctPuDs7C3iOsKKruihLC7vZqIXoX7VehhwBPagC0nOIDTm3Hn37HcPEWxJdaaooaR00ijpfZTld"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      setMessage("❌ Vous devez être connecté pour payer.");
      setLoading(false);
      return;
    }

    const amount = selectedPlan === "monthly" ? 3000 : 25000;

    try {
      const { data } = await axios.post(
        "http://localhost:5000/payments/create-payment-intent",
        {
          amount,
          currency: "eur",
          userId: storedUser.id,
        }
      );

      if (!stripe || !elements) {
        setMessage("❌ Stripe n'est pas prêt.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        setMessage("❌ Erreur : " + error.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("✅ Paiement réussi !");
        await axios.put(
          `http://localhost:5000/payments/update/${data.paymentId}`,
          {
            status: "Effectué",
          }
        );
      } else {
        setMessage("⚠ En attente : " + paymentIntent.status);
      }
    } catch (err) {
      setMessage("❌ Problème réseau ou serveur.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl text-white animate-fade-in"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaLock /> Paiement Sécurisé
      </h2>

      <p className="mb-4">Choisissez votre abonnement :</p>
      <div className="flex flex-col gap-4 mb-6">
        <label
          className={`p-4 rounded-xl cursor-pointer shadow hover:scale-105 transition 
          ${
            selectedPlan === "monthly"
              ? "bg-blue-600"
              : "bg-white bg-opacity-30"
          }`}
        >
          <input
            type="radio"
            name="plan"
            value="monthly"
            checked={selectedPlan === "monthly"}
            onChange={() => setSelectedPlan("monthly")}
            className="mr-2 hidden"
          />
          🌙 Abonnement Mensuel - <strong>30€</strong> / mois
        </label>

        <label
          className={`p-4 rounded-xl cursor-pointer shadow hover:scale-105 transition 
          ${
            selectedPlan === "yearly" ? "bg-blue-600" : "bg-white bg-opacity-30"
          }`}
        >
          <input
            type="radio"
            name="plan"
            value="yearly"
            checked={selectedPlan === "yearly"}
            onChange={() => setSelectedPlan("yearly")}
            className="mr-2 hidden"
          />
          🌟 Abonnement Annuel - <strong>250€</strong> / an
        </label>
      </div>

      <div className="p-4 bg-white bg-opacity-30 rounded-xl shadow mb-6">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
      >
        {loading
          ? "💳 Paiement en cours..."
          : `Payer ${selectedPlan === "monthly" ? "30€" : "250€"}`}
      </button>

      {message && (
        <p
          className={`mt-6 p-4 rounded-xl shadow ${
            message.includes("✅")
              ? "bg-green-500 text-white"
              : message.includes("❌")
              ? "bg-red-500 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

const Payment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 p-6 flex items-center justify-center">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Payment;
