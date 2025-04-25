// src/components/RedirectByRole.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RedirectByRole = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  switch (role) {
    case "student":
      return <Navigate to="/student" />;
    case "school":
      return <Navigate to="/school" />;
    case "employer":
      return <Navigate to="/employer" />;
    case "admin":
      return <Navigate to="/admin" />;
    default:
      return <p> Invalid role: {role}</p>;
  }
};

export default RedirectByRole;
