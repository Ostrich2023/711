import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Title, Text, Button, Loader, Paper } from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { listSkills } from "../../services/skillService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function JobDetail() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchSkills();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/job/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error("Failed to load job:", err);
    }
  };

  const fetchSkills = async () => {
    try {
      const token = await user.getIdToken();
      const res = await listSkills(token);
      const approved = res.filter(skill => skill.verified === "approved");
      setSkills(approved);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const token = await user.getIdToken();
      await axios.post(`${BASE_URL}/student/apply`, {
        jobId,
        skillsSnapshot: skills,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplied(true);
    } catch (err) {
      console.error("Application failed:", err);
    }
  };

  if (loading || !job) return <Loader mt="lg" />;

  return (
    <Box mt="md">
      <Paper withBorder p="md">
        <Title order={3}>{job.title}</Title>
        <Text>{job.description}</Text>
        <Text c="dimmed" size="sm">Company: {job.company}</Text>
        <Text c="dimmed" size="sm">Skills: {job.skills?.join(", ")}</Text>
        <Button mt="md" disabled={applied} onClick={handleApply}>
          {applied ? "Applied" : "Apply for this job"}
        </Button>
      </Paper>
    </Box>
  );
}
