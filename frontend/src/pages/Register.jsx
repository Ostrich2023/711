import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [schoolId, setSchoolId] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);
  const navigate = useNavigate();
  const { setUser, setRole: setGlobalRole } = useAuth();

  useEffect(() => {
    fetchSchoolList();
  }, []);

  const fetchSchoolList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employer/schools`);
      setSchoolOptions(res.data); // should be [{ code, name }]
    } catch (error) {
      console.error("Failed to fetch school list:", error);
    }
  };

  const register = async () => {
    try {
      if (!email || !password) {
        alert("Email and password are required.");
        return;
      }

      if ((role === "student" || role === "school") && !schoolId) {
        alert("Please select a school.");
        return;
      }

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
        createdAt: serverTimestamp()
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
        `Registration successful.\n\nWallet Address: ${wallet.address}\n\nMnemonic (keep it safe!):\n${wallet.mnemonic.phrase}`
      );
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Register</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginBottom: "10px" }}>
        <option value="student">Student</option>
        <option value="school">Teacher / School</option>
        <option value="employer">Employer</option>
      </select>

      {(role === "student" || role === "school") && (
        <select
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">-- Select School --</option>
          {schoolOptions.map((school) => (
            <option key={school.code} value={school.code}>
              {school.name}
            </option>
          ))}
        </select>
      )}

      <button onClick={register}>Create Account</button>
    </div>
  );
}

export default Register;