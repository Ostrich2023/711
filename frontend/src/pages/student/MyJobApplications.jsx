// src/pages/student/MyJobApplications.jsx
import { useEffect, useState } from "react";
import { Box, Title, Loader, Stack, Paper, Text } from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyJobApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/student/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader mt="md" />;

  return (
    <Box mt="md">
      <Title order={3} mb="md">My Applications</Title>
      {applications.length === 0 ? (
        <Text>No applications submitted yet.</Text>
      ) : (
        <Stack>
          {applications.map((app) => (
            <Paper key={app.id} withBorder p="md">
              <Text fw={600}>{app.jobTitle}</Text>
              <Text c="dimmed">Company: {app.company}</Text>
              <Text c="dimmed">Submitted At: {new Date(app.appliedAt.seconds * 1000).toLocaleString()}</Text>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
