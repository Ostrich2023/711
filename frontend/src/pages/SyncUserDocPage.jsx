import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase";

const SyncUserDocPage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("");

  const handleSync = async () => {
    try {
      setStatus("Syncing...");
      const functions = getFunctions(app);
      const syncUser = httpsCallable(functions, "syncUserDoc");
      const res = await syncUser(); // Call the Cloud Function
      setStatus(` ${res.data.message}`);
    } catch (err) {
      console.error("Sync error:", err);
      setStatus(" Sync failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sync My User Document</h2>
      <p>This will create your user document in Firestore if not already exists.</p>
      <button onClick={handleSync}>Sync Firestore User Doc</button>
      <p>{status}</p>
    </div>
  );
};

export default SyncUserDocPage;
