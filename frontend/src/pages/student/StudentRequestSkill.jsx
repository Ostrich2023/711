import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Select,
  FileInput,
  Button,
  Title,
  Stack,
  Paper,
  Text,
  Group,
  Loader,
  Divider,
} from "@mantine/core";
import axios from "axios";
import { uploadToIPFS } from "../../ipfs/uploadToIPFS";
import { listSkills, deleteSkill } from "../../services/skillService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StudentRequestSkill() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [form, setForm] = useState({ level: "Beginner", file: null });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSkills();
      fetchCourses();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      const token = await user.getIdToken();
      const data = await listSkills(token);
      setSkills(data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/student/list-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseList(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const selectedCourse = courseList.find(c => c.id === selectedCourseId);

  const handleSubmit = async () => {
    if (!selectedCourseId || !form.level) {
      alert("Please complete all required fields.");
      return;
    }

    let attachmentCid = "";

    if (form.file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSizeMB = 5;

      if (!allowedTypes.includes(form.file.type)) {
        alert("Only PDF or DOCX files are allowed.");
        return;
      }

      if (form.file.size > maxSizeMB * 1024 * 1024) {
        alert("File size exceeds 5MB.");
        return;
      }

      try {
        setLoading(true);
        attachmentCid = await uploadToIPFS(form.file);
      } catch (error) {
        console.error("Upload error:", error);
        alert("File upload failed.");
        setLoading(false);
        return;
      }
    }

    try {
      const token = await user.getIdToken();
      await axios.post(`${BASE_URL}/skill/add`, {
        courseId: selectedCourseId,
        level: form.level,
        attachmentCid,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Skill submitted.");
      setForm({ level: "Beginner", file: null });
      setSelectedCourseId(null);
      fetchSkills();
    } catch (err) {
      console.error("Failed to submit skill:", err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await user.getIdToken();
      await deleteSkill(token, id);
      fetchSkills();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <Box mt="30px">
      <Paper shadow="xs" p="md" withBorder mb="xl">
        <Title order={3} mb="md">Submit Skill</Title>
        <Stack>
          <Select
            label="Select Course"
            placeholder="Choose a course"
            value={selectedCourseId}
            onChange={setSelectedCourseId}
            data={courseList.map(c => ({
              value: c.id,
              label: `${c.code} - ${c.title}`,
            }))}
            required
          />

          {selectedCourse && (
            <Paper withBorder p="sm" radius="md" bg="gray.0">
              <Text fw={500}>Skill: {selectedCourse.skillTemplate?.skillTitle}</Text>
              <Text size="sm" c="dimmed">{selectedCourse.skillTemplate?.skillDescription}</Text>
            </Paper>
          )}

          <Select
            label="Skill Level"
            data={["Beginner", "Intermediate", "Advanced"]}
            value={form.level}
            onChange={(val) => setForm(prev => ({ ...prev, level: val }))}
          />

          <FileInput
            label="Attachment (PDF or DOCX)"
            value={form.file}
            onChange={(file) => setForm(prev => ({ ...prev, file }))}
            accept=".pdf,.docx"
          />

          <Button onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </Stack>
      </Paper>

      <Title order={3}>Your Skills</Title>
      {isFetching ? (
        <Loader />
      ) : skills.length === 0 ? (
        <Text>No skills submitted yet.</Text>
      ) : (
        <Stack mt="md">
          {skills.map(skill => (
            <Paper key={skill.id} withBorder p="md" radius="md">
              <Title order={5}>{skill.title} ({skill.level})</Title>
              <Text size="sm" c="gray">Course: {skill.courseTitle} ({skill.courseCode})</Text>
              <Text size="sm" mt="xs">{skill.description}</Text>

              {skill.attachmentCid && (
                <Text size="sm" mt="xs">
                  📎 <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank">View Attachment</a>
                </Text>
              )}

              <Divider my="sm" />

              <Text size="sm">
                Status: {
                  skill.verified === "approved" ? " Approved"
                  : skill.verified === "rejected" ? " Rejected"
                  : "⏳ Pending"
                }
              </Text>

              {skill.score !== undefined && (
                <Text size="sm">Score: {skill.score}/5</Text>
              )}

              <Group mt="xs">
                <Button size="xs" color="red" variant="light" onClick={() => handleDelete(skill.id)}>
                  Delete
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
