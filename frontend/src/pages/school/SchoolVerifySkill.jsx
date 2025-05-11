import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Paper,
  Title,
  Text,
  Group,
  Button,
  NumberInput,
  Textarea,
  Loader,
  Stack,
  Divider,
} from "@mantine/core";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TeacherVerifyPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({}); // { skillId: { score, note } }

  useEffect(() => {
    if (user) fetchPendingSkills();
  }, [user]);

  const fetchPendingSkills = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/teacher/pending-skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (skillId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [field]: value,
      },
    }));
  };

  const handleReview = async (skillId, decision) => {
    const { score, note } = formState[skillId] || {};

    if (decision === "approved" && (score == null || score < 0 || score > 5)) {
      alert("Please provide a score between 0 and 5.");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${BASE_URL}/teacher/verify-skill/${skillId}`,
        { decision, score, note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Skill ${decision === "approved" ? "approved" : "rejected"} successfully.`);
      fetchPendingSkills(); // reload list
    } catch (err) {
      console.error("Review failed:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <Box mt="30px">
      <Title order={2} mb="lg">Skill Review Dashboard</Title>
      {loading ? (
        <Loader />
      ) : skills.length === 0 ? (
        <Text>No pending skills.</Text>
      ) : (
        skills.map((skill) => (
          <Paper key={skill.id} p="md" shadow="xs" radius="md" withBorder mb="md">
            <Title order={4}>{skill.title} ({skill.level})</Title>
            <Text c="dimmed" size="sm">
              Course: {skill.courseTitle} ({skill.courseCode})
            </Text>
            <Text size="sm" mt="xs">{skill.description}</Text>

            {skill.attachmentCid && (
              <Text mt="xs" size="sm">
                📎 <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank" rel="noreferrer">
                  View Document
                </a>
              </Text>
            )}

            <Divider my="sm" />

            <Stack>
              <NumberInput
                label="Score (0 - 5)"
                value={formState[skill.id]?.score || ""}
                onChange={(val) => handleInputChange(skill.id, "score", val)}
                min={0}
                max={5}
                precision={1}
                step={0.1}
              />

              <Textarea
                label="Feedback / Note"
                placeholder="Write a short comment..."
                value={formState[skill.id]?.note || ""}
                onChange={(e) => handleInputChange(skill.id, "note", e.target.value)}
              />

              <Group mt="xs">
                <Button
                  color="green"
                  onClick={() => handleReview(skill.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  color="red"
                  variant="light"
                  onClick={() => handleReview(skill.id, "rejected")}
                >
                  Reject
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
}
