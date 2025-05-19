import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase";
import {
  Box,
  Title,
  Text,
  Button,
  Notification,
  Loader,
  Stack,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

const SyncUserDocPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const functions = getFunctions(app);
      const syncUser = httpsCallable(functions, "syncUserDoc");
      const res = await syncUser();
      setStatus(res.data.message || "Sync completed.");
      setSuccess(true);
    } catch (err) {
      console.error("Sync error:", err);
      setError(err.message || "Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt="xl" px="lg">
      <Stack>
        <Title order={2}>Sync Firestore User Document</Title>
        <Text c="dimmed">
          This function creates or updates your user document in Firestore if it's missing.
        </Text>

        <Button onClick={handleSync} loading={loading} mt="md">
          Sync User Doc
        </Button>

        {success && (
          <Notification icon={<IconCheck size={18} />} color="teal" title="Success" mt="sm">
            {status}
          </Notification>
        )}

        {error && (
          <Notification icon={<IconX size={18} />} color="red" title="Error" mt="sm">
            {error}
          </Notification>
        )}
      </Stack>
    </Box>
  );
};

export default SyncUserDocPage;
