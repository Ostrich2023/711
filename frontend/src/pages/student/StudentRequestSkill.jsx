import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box, Text, Title, Stack, Group, Paper, Button, Select, Tabs, SimpleGrid,
  FileInput, Divider, Loader, Modal, MultiSelect, Collapse , Badge, 
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { uploadToIPFS } from "../../ipfs/uploadToIPFS";
import { listSkills, deleteSkill } from "../../services/skillService";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SkillReviewDetails({ skill, softSkillMap }) {
  const [opened, setOpened] = useState(false);

  return (
    <Box mt="sm">
      <Button
        variant="subtle"
        size="xs"
        onClick={() => setOpened((o) => !o)}
        rightSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        mb="xs"
      >
        {opened ? "Hide Details" : "Show Details"}
      </Button>

      <Collapse in={opened}>
        {/* Hard Skills */}
        {skill.hardSkillScores && (
          <Box mt="sm">
            <Title order={5} size="sm" mb={4}>Hard Skills</Title>
            <SimpleGrid cols={2} spacing="xs">
              {Object.entries(skill.hardSkillScores).map(([k, v], i) => (
                <Group key={i} spacing={6} align="flex-start">
                  <Text size="sm" fw={500}> {k}</Text>
                  <Text size="sm" c="gray">{v.score}/5</Text>
                </Group>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Soft Skills */}
        {skill.softSkillScores && (
          <Box mt="sm">
            <Title order={5} size="sm" mb={4}>Soft Skills</Title>
            <SimpleGrid cols={2} spacing="xs">
              {Object.entries(skill.softSkillScores).map(([k, v], i) => (
                <Group key={i} spacing={6} align="flex-start">
                  <Text size="sm" fw={500}> {softSkillMap[k] || k}</Text>
                  <Text size="sm" c="gray">{v.score}/5</Text>
                </Group>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Collapse>
    </Box>
  );
}

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

   const [opened, setOpened] = useState(false);

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

      <Tabs radius="md" defaultValue="list" mt="20px">
        <Tabs.List>
          <Tabs.Tab value="list" style={{ fontSize: 16, fontWeight: 600 }}>{t("request.history")}</Tabs.Tab>
          <Tabs.Tab value="create" style={{ fontSize: 16, fontWeight: 600 }}>{t("request.create")}</Tabs.Tab>
        </Tabs.List>

      <Tabs.Panel value="create">
        <Paper withBorder shadow="xs" p="md" mt="md">
          <Stack spacing="sm">
            <Group grow>
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
            </Group>

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
      </Tabs.Panel>

      <Tabs.Panel value="list">
        {isFetching ? (
          <Loader mt="md" />
        ) : skills.length === 0 ? (
          <Text>{t("course.noCourses")}</Text>
        ) : (
          <Stack spacing={0}>
            {skills.map((skill, index) => (
              <Box
                key={skill.id}
                p="md"
                onClick={() => {}}
                style={{
                  borderTop: index === 0 ? "1px solid #e0e0e0" : "none",
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                }}
              >
              <Group>
                <Text fw={600} size="18px">{skill.title}</Text>
                <Text size="sm" c="gray">
                  {skill.courseCode} - {skill.courseTitle}
                </Text>
                <Text size="sm" mt={4}>{skill.level}</Text>                
              </Group>


                <Box mt="xs" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  {/* 左边的状态和技能 tags */}
                  <Group spacing="xs" wrap="wrap">
                    {skill.verified === "approved" ? (
                      <Badge color="green" size="xs" radius="xl" variant="filled">APPROVED</Badge>
                    ) : skill.verified === "rejected" ? (
                      <Badge color="red" size="xs" radius="xl" variant="filled">REJECTED</Badge>
                    ) : (
                      <Badge color="gray" size="xs" radius="xl" variant="filled">PENDING</Badge>
                    )}

                    {(skill.softSkills || []).map((sid, i) => (
                      <Badge key={i} variant="light" color="blue" size="xs">
                        {softSkillMap[sid] || sid}
                      </Badge>
                    ))}
                  </Group>

                  {/* 右边的删除按钮 */}
                  <Group>
                    <Button
                      size="xs"
                      color="blue"
                      variant="light"
                      onClick={() => {
                        if (skill.attachmentCid) {
                          window.open(`https://ipfs.io/ipfs/${skill.attachmentCid}`, '_blank');
                        } else {
                          alert("No attachment available");
                        }
                      }}
                    >
                      View Attachment
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      onClick={() => handleDelete(skill.id)}
                    >
                      {t("request.delete")}
                    </Button>   
                  </Group>
  
                </Box>

                <SkillReviewDetails skill={skill} softSkillMap={softSkillMap} />

              </Box>
            ))}
          </Stack>
        )}

        {/* 强制选择专业的 Modal */}
        <Modal
          opened={forceMajorModal}
          onClose={() => {}}
          title={t("request.selectMajorModalTitle")}
          centered
          withCloseButton={false}
        >
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
      </Tabs.Panel>

      </Tabs>
    </Box>
  );
}
