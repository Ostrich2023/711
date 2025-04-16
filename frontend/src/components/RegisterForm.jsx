import React, { useState } from "react";
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
  Select
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm({ onRegister, schoolOptions = [] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [role, setRole] = useState("student");
  const [schoolId, setSchoolId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !confirmPwd) {
      return setError("Please complete all fields");
    }

    if (password !== confirmPwd) {
      return setError("Passwords do not match");
    }

    if ((role === "student" || role === "school") && !schoolId) {
      return setError("Please select a school");
    }

    try {
      await onRegister(email, password, role, schoolId);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome to Skivy!</Title>
      <Text size="lg" ta="center" mt={18}>Create a new account</Text>

      <Paper withBorder shadow="md" p={30} mt={20} radius="md">
        {error && <Text color="red" mb="sm">{error}</Text>}

        <TextInput label="Email" placeholder="Your email" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput label="Password" placeholder="Password" value={password} required mt="md" onChange={(e) => setPassword(e.target.value)} />
        <PasswordInput label="Re-enter Password" placeholder="Confirm password" value={confirmPwd} required mt="md" onChange={(e) => setConfirmPwd(e.target.value)} />

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
          <Checkbox label="I agree to the registration agreement" />
        </Group>

        <Button fullWidth mt="lg" onClick={handleRegister}>Register</Button>

        <Group mt="md" justify="center">
          <Text size="sm">Already have an account?</Text>
          <Anchor fw={700} component="button" size="sm" onClick={() => navigate("/login")}>Login</Anchor>
        </Group>
      </Paper>
    </Container>
  );
}
