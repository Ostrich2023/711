import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box, Text, Button, Loader, Center, Stack, Paper, Group
} from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function JobDetail() {
  const { user } = useAuth();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleApply = async () => {
    if (!user || !jobId) return;

    const token = await user.getIdToken();

    try {
      await axios.post(
        `${BASE_URL}/student/apply`,
        {
          jobId,
          studentId: user.uid,
          skillsSnapshot: job.skills || [], // 可替换为真实快照
          appliedAt: new Date().toISOString(),
          message: "I'd like to apply for this job.",
          status: "pending",
          note: ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Application failed", err);
      alert("Failed to apply for the job.");
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const token = await user.getIdToken();

      try {
        if (jobId) {
          const res = await axios.get(`${BASE_URL}/job/${jobId}?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJob(res.data);
        } else {
          const res = await axios.get(`${BASE_URL}/job/list?uid=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAllJobs(res.data);
        }
      } catch (err) {
        console.error("Error loading job(s):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, jobId]);

  if (loading) return <Center mt="lg"><Loader /></Center>;

  if (jobId && job) {
    return (
      <Box>
        <Text fw={600} size="xl" mb="sm">{job.title}</Text>
        <Text mb="sm">{job.description}</Text>
        <Text mb="xs">Hourly Rate: ${job.price}</Text>
        <Text mb="xs">Location: {job.location}</Text>
        <Text mb="xs">Open Positions: {job.positions}</Text>
        <Text mb="xs">Required Skills: {job.skills?.join(", ")}</Text>
        <Button mt="md" onClick={handleApply}>Apply</Button>
      </Box>
    );
  }

  if (!jobId && allJobs.length > 0) {
    return (
      <Box>
        <Text fw={700} size="xl" mb="md">Available Job Listings</Text>
        <Stack>
          {allJobs.map((j) => (
            <Paper key={j.id} withBorder p="md">
              <Group position="apart">
                <Box>
                  <Text fw={600}>{j.title}</Text>
                  <Text size="sm" c="dimmed">{j.location} • ${j.price}/hr • {j.skills?.join(", ")}</Text>
                </Box>
                <Button size="xs" component={Link} to={`/student/job/${j.id}`}>
                  View Details
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  }

  return <Text c="dimmed">No job data available.</Text>;
}
