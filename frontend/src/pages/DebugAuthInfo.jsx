import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const DebugAuthInfo = () => {
  const { user, role, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) return <p>{t("debug.loading")}</p>;
  if (!user) return <p>{t("debug.notLoggedIn")}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔎 {t("debug.title")}</h2>
      <p><strong>{t("debug.uid")}:</strong> {user.uid}</p>
      <p><strong>{t("debug.email")}:</strong> {user.email}</p>
      <p><strong>{t("debug.role")}:</strong> {role ?? t("debug.notLoaded")}</p>
      <p><strong>{t("debug.token")}:</strong> {user.accessToken?.slice(0, 20) ?? "n/a"}...</p>
    </div>
  );
};

export default DebugAuthInfo;
