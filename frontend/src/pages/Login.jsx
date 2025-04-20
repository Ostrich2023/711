// Core React and Routing
import React from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Custom Modules
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";



export default function Login() {
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const handleLogin = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("User data not found");
    const userData = userDoc.data();
    const role = userData.role;

    setUser(user);
    setRole(role);

    if (role === "student") navigate("/student");
    else if (role === "school") navigate("/school");
    else if (role === "employer") navigate("/employer");
    else throw new Error("Invalid role");
  };

  return (
    <LoginForm onLogin={handleLogin} /> 
  );
}
