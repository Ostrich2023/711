
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthGuard(requiredRole = null) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    }

    if (requiredRole && role !== requiredRole) {
      navigate("/unauthorized");
    }
  }, [navigate, requiredRole]);
}
