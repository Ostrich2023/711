import React from "react";
import { useAuth } from "../context/AuthContext";

console.log("🔍 UID:", decoded.uid);
console.log("🔍 Firestore Document:", userData);

const DebugAuthInfo = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔎 Debug: Current Auth Info</h2>
      <p><strong>UID:</strong> {user.uid}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {role ?? "⚠️ Not loaded"}</p>
      <p><strong>Token (short):</strong> {user.accessToken?.slice(0, 20) ?? "n/a"}...</p>
    </div>
  );
};

export default DebugAuthInfo;
