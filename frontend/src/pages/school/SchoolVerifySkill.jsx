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
  const [formState, setFormState] = useState({}); // { skillId: { hardSkillScores, softSkillScores, note } }

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

  const handleScoreChange = (skillId, type, skillName, field, value) => {
    setFormState((prev) => {
      const current = prev[skillId] || {};
      const section = current[type] || {};
      return {
        ...prev,
        [skillId]: {
          ...current,
          [type]: {
            ...section,
            [skillName]: {
              ...section[skillName],
              [field]: value,
            },
          },
        },
      };
    });
  };

  const handleReview = async (skillId) => {
    const { hardSkillScores, softSkillScores, note } = formState[skillId] || {};

    if (!hardSkillScores || !softSkillScores) {
      alert("Please score both hard and soft skills.");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.put(
        `${BASE_URL}/skill/review/${skillId}`,
        { hardSkillScores, softSkillScores, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Skill reviewed successfully.");
      fetchPendingSkills();
    } catch (err) {
      console.error("Review failed:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <Box mt="30px">
      <Title order={2} mb="lg">Rubric-Based Skill Review</Title>
      {loading ? (
        <Loader />
      ) : skills.length === 0 ? (
        <Text>No pending skills.</Text>
      ) : (
        skills.map((skill) => {
          const state = formState[skill.id] || {};
          return (
            <Paper key={skill.id} p="md" shadow="xs" radius="md" withBorder mb="md">
              <Title order={4}>{skill.title} ({skill.level})</Title>
              <Text c="dimmed" size="sm">
                Course: {skill.courseTitle} ({skill.courseCode})
              </Text>
              <Text size="sm" mt="xs">{skill.description}</Text>

              {skill.attachmentCid && (
                <Text mt="xs" size="sm">
                   <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank" rel="noreferrer">
                    View Document
                  </a>
                </Text>
              )}

              <Divider my="sm" />

              <Stack>
                <Title order={5}>Hard Skills</Title>
                {skill.hardSkills?.map((hard) => (
                  <Stack key={hard}>
                    <Text fw={500}>{hard}</Text>
                    <NumberInput
                      label="Score (0–5)"
                      min={0}
                      max={5}
                      precision={1}
                      value={state?.hardSkillScores?.[hard]?.score || ""}
                      onChange={(val) => handleScoreChange(skill.id, "hardSkillScores", hard, "score", val)}
                    />
                    <Textarea
                      label="Comment"
                      value={state?.hardSkillScores?.[hard]?.comment || ""}
                      onChange={(e) => handleScoreChange(skill.id, "hardSkillScores", hard, "comment", e.target.value)}
                    />
                  </Stack>
                ))}

                <Divider />

                <Title order={5}>Soft Skills</Title>
                {skill.softSkills?.map((soft) => (
                  <Stack key={soft}>
                    <Text fw={500}>{soft}</Text>
                    <NumberInput
                      label="Score (0–5)"
                      min={0}
                      max={5}
                      precision={1}
                      value={state?.softSkillScores?.[soft]?.score || ""}
                      onChange={(val) => handleScoreChange(skill.id, "softSkillScores", soft, "score", val)}
                    />
                    <Textarea
                      label="Comment"
                      value={state?.softSkillScores?.[soft]?.comment || ""}
                      onChange={(e) => handleScoreChange(skill.id, "softSkillScores", soft, "comment", e.target.value)}
                    />
                  </Stack>
                ))}

                <Textarea
                  label="Overall Note"
                  placeholder="General feedback..."
                  value={state?.note || ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      [skill.id]: {
                        ...prev[skill.id],
                        note: e.target.value,
                      },
                    }))
                  }
                />

                <Group mt="xs">
                  <Button color="green" onClick={() => handleReview(skill.id)}>
                    Submit Rubric
                  </Button>
                </Group>
              </Stack>
            </Paper>
          );
        })
      )}
    </Box>
  );
}
