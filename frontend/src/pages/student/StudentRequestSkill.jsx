import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Box, Text, Title, Stack, Group, Paper, Button, Select,
  FileInput, Divider, Loader, Modal, MultiSelect, Table, Badge, Tooltip
} from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { uploadToIPFS } from "../../ipfs/uploadToIPFS";
import { listSkills, deleteSkill } from "../../services/skillService";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StudentRequestSkill() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [form, setForm] = useState({ level: "Beginner", file: null, softSkills: [] });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [forceMajorModal, setForceMajorModal] = useState(false);

  const [majorList, setMajorList] = useState([]);
  const [softSkillMap, setSoftSkillMap] = useState({});
  const [selectedMajor, setSelectedMajor] = useState("");
  const [schoolId, setSchoolId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStudentProfile();
      fetchMajors();
      fetchSoftSkills();
      fetchSkills();
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/student/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.major) setForceMajorModal(true);
      setSelectedMajor(res.data.major);
      setSchoolId(res.data.schoolId);
      fetchCourses(res.data.schoolId, res.data.major);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchMajors = async () => {
    const token = await user.getIdToken();
    const res = await axios.get(`${BASE_URL}/course/majors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMajorList(res.data.map((m) => ({ value: m.id, label: m.name })));
  };

  const fetchSoftSkills = async () => {
    const db = getFirestore(getApp());
    const snap = await getDocs(collection(db, "soft-skills"));
    const map = {};
    snap.forEach((doc) => {
      map[doc.id] = doc.data().name;
    });
    setSoftSkillMap(map);
  };

  const fetchCourses = async (schoolId, majorId) => {
    const token = await user.getIdToken();
    const res = await axios.get(`${BASE_URL}/student/list-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCourseList(res.data.filter((c) => c.schoolId === schoolId && c.major?.id === majorId));
  };

  const fetchSkills = async () => {
    const token = await user.getIdToken();
    const data = await listSkills(token);
    setSkills(data);
    setIsFetching(false);
  };

  const handleSubmit = async () => {
    if (!selectedCourseId || !form.level || form.softSkills.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    let attachmentCid = "";
    if (form.file) {
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(form.file.type)) {
        alert("Only PDF or DOCX files are allowed.");
        return;
      }
      if (form.file.size > 5 * 1024 * 1024) {
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

    const token = await user.getIdToken();
    await axios.post(`${BASE_URL}/skill/add`, {
      courseId: selectedCourseId,
      level: form.level,
      softSkills: form.softSkills,
      attachmentCid,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Skill submitted.");
    setForm({ level: "Beginner", file: null, softSkills: [] });
    setSelectedCourseId(null);
    fetchSkills();
    setLoading(false);
  };

  const updateMajor = async () => {
    const token = await user.getIdToken();
    await axios.put(`${BASE_URL}/student/update-major`, {
      major: selectedMajor,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Major saved.");
    setForceMajorModal(false);
    fetchCourses(schoolId, selectedMajor);
  };

  const handleDelete = async (id) => {
    const token = await user.getIdToken();
    await deleteSkill(token, id);
    fetchSkills();
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
            data={courseList.map((c) => ({
              value: c.id,
              label: `${c.code} - ${c.title}`,
            }))}
            required
          />
          <Select
            label="Skill Level"
            data={["Beginner", "Intermediate", "Advanced"]}
            value={form.level}
            onChange={(val) => setForm((prev) => ({ ...prev, level: val }))}
          />
          <MultiSelect
            label="Select Soft Skills"
            placeholder="Choose up to 5 soft skills"
            data={Object.entries(softSkillMap).map(([id, name]) => ({ value: id, label: name }))}
            value={form.softSkills}
            onChange={(val) => {
              if (val.length <= 5) setForm((prev) => ({ ...prev, softSkills: val }));
              else alert("You can only select up to 5 soft skills.");
            }}
            required
          />
          <FileInput
            label="Attachment (PDF or DOCX)"
            value={form.file}
            onChange={(file) => setForm((prev) => ({ ...prev, file }))}
            accept=".pdf,.docx"
          />
          <Text size="sm" color="dimmed">
            Current Major: {majorList.find((m) => m.value === selectedMajor)?.label || "Not set"}
          </Text>
          <Button onClick={handleSubmit} loading={loading}>Submit</Button>
        </Stack>
      </Paper>

      <Title order={4}>Your Skills</Title>
      {isFetching ? <Loader /> : (
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Course</th>
              <th>Skill</th>
              <th>Level</th>
              <th>Soft Skills</th>
              <th>Status</th>
              <th>File</th>
              <th>Rubric</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.courseCode} - {skill.courseTitle}</td>
                <td>{skill.title}</td>
                <td>{skill.level}</td>
                <td>
                  <Group spacing="xs">
                    {(skill.softSkills || []).map((sid, i) => (
                      <Badge key={i} variant="outline" color="blue" size="sm">
                        {softSkillMap[sid] || sid}
                      </Badge>
                    ))}
                  </Group>
                </td>
                <td>
                  {skill.verified === "approved" ? "✅ Approved"
                    : skill.verified === "rejected" ? "❌ Rejected"
                      : "⏳ Pending"}
                </td>
                <td>
                  {skill.attachmentCid ? (
                    <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank" rel="noreferrer">
                      📄 View
                    </a>
                  ) : "-"}
                </td>
                <td>
                  <Stack spacing={2}>
                    {skill.hardSkillScores &&
                      Object.entries(skill.hardSkillScores).map(([k, v], i) => (
                        <Tooltip label={v.comment || "No comment"} key={i}>
                          <Text size="xs">🛠 {k}: {v.score}/5</Text>
                        </Tooltip>
                      ))}
                    {skill.softSkillScores &&
                      Object.entries(skill.softSkillScores).map(([k, v], i) => (
                        <Tooltip label={v.comment || "No comment"} key={i}>
                          <Text size="xs">🤝 {k}: {v.score}/5</Text>
                        </Tooltip>
                      ))}
                    {skill.note && (
                      <Text size="xs" c="dimmed">📝 {skill.note}</Text>
                    )}
                  </Stack>
                </td>
                <td>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => handleDelete(skill.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal opened={forceMajorModal} onClose={() => {}} title="Select Your Major" centered withCloseButton={false}>
        <Stack>
          <Text>You must select your major before submitting skills.</Text>
          <Select
            placeholder="Choose your major"
            data={majorList}
            value={selectedMajor}
            onChange={setSelectedMajor}
          />
          <Button disabled={!selectedMajor} onClick={updateMajor}>
            Save Major
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
