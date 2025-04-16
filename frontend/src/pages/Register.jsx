import React, { useEffect, useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setUser, setRole: setGlobalRole } = useAuth();

  useEffect(() => {
    const fetchSchoolList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employer/schools`);
        setSchoolOptions(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch school list:", error);
        alert("Failed to load school list.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolList();
  }, []);

  const handleRegister = async (email, password, role, schoolId) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const wallet = ethers.Wallet.createRandom();
    const prefix = role === "student" ? "S" : role === "school" ? "T" : "E";
    const customUid = `${prefix}-${user.uid}`;

    const userData = {
      email: user.email,
      role,
      walletAddress: wallet.address,
      customUid,
      createdAt: serverTimestamp(),
    };

    if (role === "student" || role === "school") {
      userData.schoolId = schoolId;
    }

    await setDoc(doc(db, "users", user.uid), userData);

    setUser(user);
    setGlobalRole(role);

    if (role === "student") navigate("/student");
    else if (role === "school") navigate("/school");
    else navigate("/employer");

    alert(
      `✅ Registration successful.\n\nWallet Address: ${wallet.address}\n\nMnemonic (keep this safe!):\n${wallet.mnemonic.phrase}`
    );
  };

  if (loading) return <p>Loading school list...</p>;

  return (
    <RegisterForm onRegister={handleRegister} schoolOptions={schoolOptions} />
  );
}
