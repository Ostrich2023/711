
import React from "react";
import { Title, Text, Button, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Container style={{ textAlign: "center", paddingTop: "80px" }}>
      <Title order={2}>🚫 Access Denied</Title>
      <Text mt="md">You do not have permission to view this page.</Text>
      <Button mt="lg" onClick={() => navigate("/")}>
        Go Back Home
      </Button>
    </Container>
  );
}
