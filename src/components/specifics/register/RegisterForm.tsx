import React, { useState } from "react";
import { AuthActions } from "@/api/auth";
import { useNavigate } from "react-router-dom";

const authActions = AuthActions();

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await authActions.register(email, email, password); // Using email as username

      // if (response) {
      //   // Optionally log in automatically after registration
      //   console.log("response", response);
      //   // navigate("/login");
      // } else {
      //   setError("Registration failed. Please try again.");
      // }
      console.log("response", response);
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-[30rem] mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirmar contraseña:</label>
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
