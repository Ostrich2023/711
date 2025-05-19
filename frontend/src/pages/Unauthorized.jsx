import React from "react";
import { Title, Text, Button, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container style={{ textAlign: "center", paddingTop: "80px" }}>
      <Title order={2}> {t("unauthorized.title")}</Title>
      <Text mt="md">{t("unauthorized.message")}</Text>
      <Button mt="lg" onClick={() => navigate("/")}>
        {t("unauthorized.back")}
      </Button>
    </Container>
  );
}
