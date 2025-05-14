import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Box, Paper, Title, Text, Group, Button,
  NumberInput, Textarea, Loader, Stack, Divider, Select, Collapse, Progress
} from "@mantine/core";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SchoolVerifySkill() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({});
  const [softSkillMap, setSoftSkillMap] = useState({});
  const skillRefs = useRef({});

  useEffect(() => {
    if (user) {
      fetchSoftSkills();
      fetchPendingSkills();
    }
  }, [user]);

  const fetchSoftSkills = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/course/soft-skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const map = {};
      res.data.forEach((s) => {
        map[s.id] = s.name;
      });
      setSoftSkillMap(map);
    } catch (err) {
      console.error("Failed to load soft skills:", err);
    }
  };

  const fetchPendingSkills = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/teacher/pending-skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const detailedSkills = await Promise.all(
        res.data.map(async (skill) => {
          let hardSkills = [];
          try {
            const courseRes = await axios.get(`${BASE_URL}/school/course/${skill.courseId}/details`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            hardSkills = courseRes.data.hardSkills || [];
          } catch (err) {
            console.warn(`Failed to fetch course ${skill.courseId}:`, err);
          }
          return { ...skill, hardSkills };
        })
      );

      setSkills(detailedSkills);
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
    const state = formState[skillId] || {};
    const { decision, hardSkillScores, softSkillScores, note } = state;

    if (!decision) {
      alert("Please select approve or reject.");
      return;
    }

    if (decision === "approved" &&
      (!hardSkillScores || !softSkillScores)) {
      alert("Please complete both hard and soft skill scores before approving.");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.put(`${BASE_URL}/skill/review/${skillId}`, {
        verified: decision,
        hardSkillScores: decision === "approved" ? hardSkillScores : null,
        softSkillScores: decision === "approved" ? softSkillScores : null,
        note,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Skill reviewed.");

      // 自动收起评分区域
      setFormState((prev) => {
        const updated = { ...prev };
        delete updated[skillId];
        return updated;
      });

      // 自动跳转到下一个技能
      const skillIndex = skills.findIndex((s) => s.id === skillId);
      const nextSkill = skills[skillIndex + 1];
      if (nextSkill && skillRefs.current[nextSkill.id]) {
        setTimeout(() => {
          skillRefs.current[nextSkill.id].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }

      // 刷新技能列表
      fetchPendingSkills();
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Error submitting review.");
    }
  };

  return (
    <Box mt="30px">
      <Title order={2} mb="lg">Rubric-Based Skill Review</Title>

      {skills.length > 0 && (
        <Box mb="lg">
          <Text mb={4}>
            Skill Review Progress: {skills.length - Object.keys(formState).length} / {skills.length}
          </Text>
          <Progress value={(skills.length - Object.keys(formState).length) / skills.length * 100} color="teal" />
        </Box>
      )}

      {loading ? (
        <Loader />
      ) : skills.length === 0 ? (
        <Text>No pending skills.</Text>
      ) : (
        skills.map((skill) => {
          const state = formState[skill.id] || {};
          const decision = state.decision;

          return (
            <div key={skill.id} ref={(el) => (skillRefs.current[skill.id] = el)}>
              <Paper p="md" radius="md" shadow="xs" withBorder mb="lg">
                <Title order={4}>{skill.title} ({skill.level})</Title>
                <Text size="sm" c="dimmed">Course: {skill.courseTitle} ({skill.courseCode})</Text>
                <Text size="sm" mt="xs">{skill.description}</Text>
                {skill.attachmentCid && (
                  <Text mt="xs" size="sm">
                    <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank" rel="noreferrer">View Document</a>
                  </Text>
                )}

                <Divider my="sm" />

                <Stack>
                  <Select
                    label="Approval Decision"
                    placeholder="Select decision"
                    value={state?.decision || ""}
                    onChange={(val) => {
                      setFormState((prev) => ({
                        ...prev,
                        [skill.id]: { ...prev[skill.id], decision: val },
                      }));

                      if (val === "approved" && skillRefs.current[skill.id]) {
                        setTimeout(() => {
                          skillRefs.current[skill.id].scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 200);
                      }
                    }}
                    data={[
                      { value: "approved", label: "✅ Approve" },
                      { value: "rejected", label: "❌ Reject" },
                    ]}
                  />

                  {!decision && (
                    <Text size="sm" c="red">
                      ⚠️ Please select Approve or Reject to continue.
                    </Text>
                  )}

                  <Collapse in={decision === "approved"}>
                    <div>
                      <Title order={5} mt="md">Hard Skills</Title>
                      {skill.hardSkills.length === 0 ? (
                        <Text size="sm" c="dimmed">No hard skills defined for this course.</Text>
                      ) : (
                        skill.hardSkills.map((hard) => (
                          <Stack key={hard}>
                            <Text fw={500}>{hard}</Text>
                            <NumberInput
                              label="Score (0–5)"
                              min={0}
                              max={5}
                              precision={1}
                              value={state?.hardSkillScores?.[hard]?.score || ""}
                              onChange={(val) =>
                                handleScoreChange(skill.id, "hardSkillScores", hard, "score", val)
                              }
                            />
                            <Textarea
                              label="Comment"
                              value={state?.hardSkillScores?.[hard]?.comment || ""}
                              onChange={(e) =>
                                handleScoreChange(skill.id, "hardSkillScores", hard, "comment", e.target.value)
                              }
                            />
                          </Stack>
                        ))
                      )}

                      <Divider my="sm" />

                      <Title order={5}>Soft Skills</Title>
                      {skill.softSkills?.map((softId) => (
                        <Stack key={softId}>
                          <Text fw={500}>{softSkillMap[softId] || softId}</Text>
                          <NumberInput
                            label="Score (0–5)"
                            min={0}
                            max={5}
                            precision={1}
                            value={state?.softSkillScores?.[softId]?.score || ""}
                            onChange={(val) =>
                              handleScoreChange(skill.id, "softSkillScores", softId, "score", val)
                            }
                          />
                          <Textarea
                            label="Comment"
                            value={state?.softSkillScores?.[softId]?.comment || ""}
                            onChange={(e) =>
                              handleScoreChange(skill.id, "softSkillScores", softId, "comment", e.target.value)
                            }
                          />
                        </Stack>
                      ))}
                    </div>
                  </Collapse>

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
            </div>
          );
        })
      )}
    </Box>
  );
}
