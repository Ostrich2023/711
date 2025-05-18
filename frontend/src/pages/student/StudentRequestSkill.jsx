import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    setCourseList(
  res.data.filter((c) => {
    const courseMajorId = typeof c.major === "object" && c.major.id ? c.major.id : c.major;
    return c.schoolId === schoolId && courseMajorId === majorId;
  })
);
  };

  const fetchSkills = async () => {
    setIsFetching(true);
    try {
      const token = await user.getIdToken();
      const res = await listSkills(token);
      setSkills(res);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id) => {
    const token = await user.getIdToken();
    await deleteSkill(id, token);
    fetchSkills();
  };

  const updateMajor = async () => {
    const token = await user.getIdToken();
    await axios.put(`${BASE_URL}/student/update-major`, { major: selectedMajor }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForceMajorModal(false);
    fetchCourses(schoolId, selectedMajor);
  };

  const handleSubmit = async () => {
    if (!selectedCourseId || !form.file || form.softSkills.length === 0) return;
    setLoading(true);
    try {
      const cid = await uploadToIPFS(form.file);
      const token = await user.getIdToken();
      await axios.post(`${BASE_URL}/skill/add`, {
        courseId: selectedCourseId,
        fileCid: cid,
        level: form.level,
        softSkills: form.softSkills,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
      setForm({ level: "Beginner", file: null, softSkills: [] });
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt="md">
      <Title order={2}>{t("request.submit")}</Title>

      <Paper withBorder shadow="xs" p="md" mt="md">
        <Stack spacing="sm">
          <Select
            label={t("request.course")}
            placeholder={t("request.course")}
            data={courseList.map(c => ({ value: c.id, label: `${c.code} - ${c.title}` }))}
            value={selectedCourseId}
            onChange={setSelectedCourseId}
          />
          <Select
            label={t("request.level")}
            data={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
            ]}
            value={form.level}
            onChange={(v) => setForm({ ...form, level: v })}
          />
          <MultiSelect
            label={t("request.softSkills")}
            data={Object.entries(softSkillMap).map(([id, name]) => ({ value: id, label: name }))}
            value={form.softSkills}
            onChange={(v) => setForm({ ...form, softSkills: v })}
            maxSelectedValues={5}
          />
          <FileInput
            label={t("request.file")}
            description={t("request.fileNote")}
            accept=".pdf,.doc,.docx"
            value={form.file}
            onChange={(f) => setForm({ ...form, file: f })}
          />
          <Button loading={loading} onClick={handleSubmit}>
            {t("request.submitBtn")}
          </Button>
        </Stack>
      </Paper>

      <Divider my="lg" />
      <Title order={3}>{t("request.history")}</Title>

      {isFetching ? <Loader mt="md" /> : (
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{t("request.course")}</th>
              <th>{t("request.submit")}</th>
              <th>{t("request.level")}</th>
              <th>{t("request.softSkills")}</th>
              <th>{t("request.status")}</th>
              <th>{t("request.file")}</th>
              <th>{t("request.rubricTitle")}</th>
              <th>{t("request.action")}</th>
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
                  {skill.verified === "approved" ? t("request.statusApproved")
                    : skill.verified === "rejected" ? t("request.statusRejected")
                      : t("request.statusPending")}
                </td>
                <td>
                  {skill.attachmentCid ? (
                    <a href={`https://ipfs.io/ipfs/${skill.attachmentCid}`} target="_blank" rel="noreferrer">
                      {t("request.viewFile")}
                    </a>
                  ) : "-"}
                </td>
                <td>
                  <Stack spacing={2}>
                    {skill.hardSkillScores &&
                      Object.entries(skill.hardSkillScores).map(([k, v], i) => (
                        <Tooltip label={v.comment || t("request.rubricComment")} key={i}>
                          <Text size="xs">🛠 {k}: {v.score}/5</Text>
                        </Tooltip>
                      ))}
                    {skill.softSkillScores &&
                      Object.entries(skill.softSkillScores).map(([k, v], i) => (
                        <Tooltip label={v.comment || t("request.rubricComment")} key={i}>
                          <Text size="xs">🤝 {softSkillMap[k] || k}: {v.score}/5</Text>
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
                    {t("request.delete")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal opened={forceMajorModal} onClose={() => {}} title={t("request.selectMajorModalTitle")} centered withCloseButton={false}>
        <Stack>
          <Text>{t("request.selectMajorNotice")}</Text>
          <Select
            placeholder={t("request.chooseMajor")}
            data={majorList}
            value={selectedMajor}
            onChange={setSelectedMajor}
          />
          <Button disabled={!selectedMajor} onClick={updateMajor}>
            {t("request.saveMajor")}
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
