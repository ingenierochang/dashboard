import React, { useState } from "react";
import { AuthActions } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

const authActions = AuthActions();

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authActions.login(email, password);

      if (response.access) {
        authActions.storeToken(response.access, "access");
        authActions.storeToken(response.refresh, "refresh");
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="w-[30rem] mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleLogin}>
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

        <Button text="Iniciar sesión" isLoading={isLoading} />
      </form>

      <div className="mt-6 w-full flex justify-end">
        <p className="flex gap-1">
          No tienes cuenta?
          <a href="/register" className="text-blue-600 underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
