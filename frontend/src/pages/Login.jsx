// Core React and Routing
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mantine UI
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Custom Context
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error(t("login.userNotFound"));

      const userData = userDoc.data();
      const role = userData.role;

      setUser(user);
      setRole(role);

      if (role === "student") navigate("/student");
      else if (role === "school") navigate("/school");
      else if (role === "employer") navigate("/employer");
      else if (role === "admin") navigate("/admin");
      else throw new Error(t("login.invalidRole"));
    } catch (err) {
      setError(err.message || t("login.loginFailed"));
    }
  };

  return (
    <div className="wrapper">
      <Paper className="form" radius={0} p={30}>
        <Title order={2} ta="center" mt="md" mb={50}>
          {t("login.title")}
        </Title>
        {error && <Text color="red">{error}</Text>}

        <TextInput
          label={t("login.email")}
          placeholder={t("login.emailPlaceholder")}
          size="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label={t("login.password")}
          placeholder={t("login.passwordPlaceholder")}
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Checkbox label={t("login.remember")} mt="xl" size="md" />

        <Button fullWidth mt="xl" size="md" onClick={handleLogin}>
          {t("login.loginBtn")}
        </Button>

        <Text ta="center" mt="md">
          {t("login.noAccount")}{" "}
          <Anchor
            fw={700}
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            {t("login.register")}
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
