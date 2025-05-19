import React, { useEffect, useState } from "react";
import {
  Box, Text, Loader, Center, Paper, Stack, Group, Button
} from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyJobApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      const token = await user.getIdToken();
      try {
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

    fetchApplications();
  }, [user]);

  if (loading) return <Center mt="lg"><Loader /></Center>;

  return (
    <Box>
      <Text fw={700} size="xl" mb="md">My Job Applications</Text>
      {applications.length === 0 ? (
        <Text c="dimmed">You haven't applied for any jobs yet.</Text>
      ) : (
        <Stack>
          {applications.map((app) => (
            <Paper key={app.id} withBorder p="md">
              <Group position="apart" align="flex-start">
                <Box>
                  <Text fw={600}>{app.jobTitle || "Untitled Job"}</Text>
                  <Text size="sm" c="dimmed">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</Text>
                  <Text size="sm" c="dimmed">Status: <b>{app.status || "pending"}</b></Text>

                  {app.note && (
                    <Text size="sm" mt="xs" c="blue.7">
                      Employer note: {app.note}
                    </Text>
                  )}
                </Box>
                <Button size="xs" component="a" href={`/student/job/${app.jobId}`}>
                  View Job
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
