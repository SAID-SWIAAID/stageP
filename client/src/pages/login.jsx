import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/auth/login", {
        phoneNumber,
        password
      });
      console.log("Login success:", res.data);
      alert("Login success!");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <img src="/logo.png" alt="Logo" className="mx-auto w-20 mb-4" />
        <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>

        <input
          type="text"
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>

        <div className="flex justify-between mt-4 text-sm text-blue-500">
          <a href="#">Mot de passe oublié ?</a>
          <a href="#">Pas encore de compte ?</a>
        </div>
      </div>
    </div>
  );
}
