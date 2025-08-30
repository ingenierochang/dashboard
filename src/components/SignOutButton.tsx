import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthActions } from "@/api/auth";

const authActions = AuthActions();

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authActions.logout();
      authActions.removeTokens();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return <button onClick={handleSignOut}>Cerrar sesión</button>;
};

export default SignOutButton;
