import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
} from '@mantine/core';

export default function RegisterForm({ onRegister, schoolOptions = [] }) {
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

  // Email validation
  const handleEmail = (val) => {
    setEmail(val);
    const valid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(val);
    setEmailWarning(val !== "" && !valid);
  };

  // Password validation
  const handlePassword = (val) => {
    setPassword(val);
    const isTooShort = val.length < 6;
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    setPasswordWarning(val !== "" && (isTooShort || !hasLetter || !hasNumber));
  };

  // Confirm password validation
  useEffect(() => {
    setConfirmPwdWarning(confirmPwd !== "" && confirmPwd !== password);
  }, [password, confirmPwd]);

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
      await onRegister(username, email, password, role, schoolId);
    } catch (err) {
      alert(err.message || "Registration failed.");
    }
  };

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
