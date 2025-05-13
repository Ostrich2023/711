// Core React and Routing
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mantine UI
import { Anchor, Button, Checkbox, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Custom Context
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
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

    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="wrapper">
      <Paper className="form" radius={0} p={30}>
        <Title order={2} ta="center" mt="md" mb={50}>Welcome back to Kanavoogle!</Title>
        {error && <Text color="red">{error}</Text>}

        <TextInput
          label="Email"
          placeholder="Your email address"
          size="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Checkbox label="Keep me logged in" mt="xl" size="md" />

        <Button fullWidth mt="xl" size="md" onClick={handleLogin}>
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor href="#" fw={700} onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
