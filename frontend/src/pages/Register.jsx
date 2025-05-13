import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Select,
} from "@mantine/core";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

// Third-party
import { ethers } from "ethers";
import axios from "axios";

// Context
import { useAuth } from "../context/AuthContext";

// API base
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordWarning, setPasswordWarning] = useState(false);

  const [confirmPwd, setConfirmPwd] = useState("");
  const [confirmPwdWarning, setConfirmPwdWarning] = useState(false);

  const [role, setRole] = useState("student");
  const [schoolId, setSchoolId] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const navigate = useNavigate();
  const { setUser, setRole: setGlobalRole } = useAuth();

  const fetchSchoolList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employer/schools`);
      setSchoolOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch school list:", error);
      alert("Failed to load school list.");
    } finally {
      setLoading(false);
    }
  };

  // fetch school list on mount
  useEffect(() => {
    fetchSchoolList();
  }, []);

  // validate confirm password
  useEffect(() => {
    setConfirmPwdWarning(confirmPwd !== "" && confirmPwd !== password);
  }, [password, confirmPwd]);

  // validation handlers
  const handleEmail = (val) => {
    setEmail(val);
    const valid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(val);
    setEmailWarning(val !== "" && !valid);
  };

  const handlePassword = (val) => {
    setPassword(val);
    const isTooShort = val.length < 6;
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    setPasswordWarning(val !== "" && (isTooShort || !hasLetter || !hasNumber));
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPwd) {
      return alert("Please complete all fields.");
    }
    if (emailWarning || passwordWarning || confirmPwdWarning) {
      return alert("Please fix the errors before submitting.");
    }
    if ((role === "student" || role === "school") && !schoolId) {
      return alert("Please select a school.");
    }
    if (!isAgreed) {
      return alert("Please agree to the registration agreement.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const wallet = ethers.Wallet.createRandom();
      const prefix = role === "student" ? "S" : role === "school" ? "T" : "E";
      const customUid = `${prefix}-${user.uid}`;

      const userData = {
        name: username,
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
        ` Registration successful.\n\nWallet Address: ${wallet.address}\n\nMnemonic (keep this safe!):\n${wallet.mnemonic.phrase}`
      );
    } catch (err) {
      alert(err.message || "Registration failed.");
    }
  };

  if (loading) return <p>Loading school list...</p>;

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome to Skivy!</Title>
      <Text size="lg" ta="center" mt={18}>Create a new account</Text>

      <Paper withBorder shadow="md" p={30} mt={20} radius="md">
        <TextInput
          label="Username"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextInput
          label="Email"
          placeholder="Your email"
          value={email}
          onChange={(e) => handleEmail(e.target.value)}
          required
          mt="md"
        />
        {emailWarning && <Text c="red" size="sm">Please enter a valid email address.</Text>}

        <PasswordInput
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => handlePassword(e.target.value)}
          required mt="md"
        />
        {passwordWarning && <Text c="red" size="sm">Password must be at least 6 characters, including letters and numbers.</Text>}

        <PasswordInput
          label="Re-enter Password"
          placeholder="Confirm password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required mt="md"
        />
        {confirmPwdWarning && <Text c="red" size="sm">Passwords do not match.</Text>}

        <Select
          label="Select your role"
          value={role}
          onChange={setRole}
          mt="md"
          data={[
            { value: "student", label: "Student" },
            { value: "school", label: "Teacher / School" },
            { value: "employer", label: "Employer" }
          ]}
        />

        {(role === "student" || role === "school") && (
          <Select
            label="Select your school"
            placeholder="Pick one"
            value={schoolId}
            onChange={setSchoolId}
            data={schoolOptions.map(s => ({ value: s.code, label: s.name }))}
            mt="md"
          />
        )}

        <Group justify="space-between" mt="lg">
          <Checkbox
            label="I agree to the registration agreement"
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
        </Group>

        <Button fullWidth mt="lg" onClick={handleRegister}>Register</Button>

        <Group mt="md" justify="center">
          <Text size="sm">Already have an account?</Text>
          <Anchor fw={700} component="button" size="sm" onClick={() => navigate("/login")}>
            Login
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
}
