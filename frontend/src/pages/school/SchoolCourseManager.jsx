import React, { useEffect, useState } from "react";
import {
  Box, TextInput, Textarea, Button, Paper, Title, Stack,
  Group, Text, Loader, Select, Modal, Tabs, Badge
} from "@mantine/core";
import axios from "axios";
import classes from "../../style/SchoolCourseManager.module.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SchoolCourseManager() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [skillTitle, setSkillTitle] = useState("");
  const [skillDescription, setSkillDescription] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editSkillTitle, setEditSkillTitle] = useState("");
  const [editSkillDescription, setEditSkillDescription] = useState("");

  const [selectedMajor, setSelectedMajor] = useState("");
  const [courses, setCourses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [hardSkills, setHardSkills] = useState([]);
  const [hardSkillInput, setHardSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadCourses();
      loadMajors();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/teacher/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMajors = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/course/majors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMajors(res.data);
    } catch (err) {
      console.error("Failed to load majors:", err);
    }
  };

  const handleCreate = async () => {
    if (!title || !code || !skillTitle || !skillDescription || !selectedMajor) {
      alert(t("request.noMajor"));
      return;
    }

    try {
      setCreating(true);
      const token = await user.getIdToken();
      await axios.post(`${BASE_URL}/course/create`, {
        title,
        code,
        major: selectedMajor,
        skillTemplate: { skillTitle, skillDescription },
        hardSkills,
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert(t("settings.saveSuccess"));
      setTitle("");
      setCode("");
      setSkillTitle("");
      setSkillDescription("");
      setSelectedMajor("");
      setHardSkills([]);
      setHardSkillInput("");
      loadCourses();
    } catch (err) {
      console.error("Course creation failed:", err);
      alert("Failed to create course.");
    } finally {
      setCreating(false);
    }
  };

  const fetchCourseDetails = async (id) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/course/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setEditingCourse({ id, ...data });
      setEditTitle(data.title || "");
      setEditCode(data.code || "");
      setEditSkillTitle(data.skillTemplate?.skillTitle || "");
      setEditSkillDescription(data.skillTemplate?.skillDescription || "");
      setSelectedMajor(data.majorId || "");
      setHardSkills(data.hardSkills || []);
      setEditModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch course:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle || !editCode || !editSkillTitle || !editSkillDescription || !selectedMajor) {
      alert(t("request.noMajor"));
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.put(`${BASE_URL}/course/update/${editingCourse.id}`, {
        title: editTitle,
        code: editCode,
        major: selectedMajor,
        skillTemplate: {
          skillTitle: editSkillTitle,
          skillDescription: editSkillDescription,
        },
        hardSkills,
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert(t("settings.saveSuccess"));
      setEditModalOpen(false);
      setEditingCourse(null);
      loadCourses();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("deleteConfirm") || "Are you sure you want to delete?")) return;
    try {
      const token = await user.getIdToken();
      await axios.delete(`${BASE_URL}/course/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted.");
      loadCourses();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <Box mt="30px">
      <Title order={2}>{t("navbar.courses")}</Title>

      <Tabs radius="md" defaultValue="list" mt="20px">
        <Tabs.List>
          <Tabs.Tab value="list" style={{ fontSize: 16, fontWeight: 600 }}>{t("course.manage")}</Tabs.Tab>
          <Tabs.Tab value="create" style={{ fontSize: 16, fontWeight: 600 }}>{t("course.create")}</Tabs.Tab>
        </Tabs.List>

        {/* Manage Courses */}
        <Tabs.Panel value="list">
          {loading ? (
            <Loader />
          ) : courses.length === 0 ? (
            <Text>{t("course.noCourses")}</Text>
          ) : (
            <Box>
              {courses.map((course) => (
                <Box key={course.id} py="sm" px="md" className={classes.course} onClick={() => fetchCourseDetails(course.id)}>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={500}>{course.title}</Text>
                    <Group>
                      <Text size="sm" mt="xs" c="gray">{course.code}</Text>
                      <Text size="sm" mt="xs">{course.skillTemplate?.skillTitle}</Text>                      
                    </Group>

                    <Text size="sm" c="dimmed" mt="6px" lineClamp={2}>{course.skillTemplate?.skillDescription}</Text>
                  </Box>
            
                  <Group mt="xs">
                    <Badge color="blue" variant="light" radius="sm">
                      {course.studentCount} {t("course.students")}
                    </Badge>    
                    {(course.hardSkills || []).map((skill, index) => (
                      <Badge key={index} color="green" variant="light" radius="sm">
                        {skill}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              ))}
            </Box>
          )}

          <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} centered size="lg" withCloseButton={false}>
            <Stack>
              <Title order={2}>Edit Course</Title>
              <Group grow>
                <TextInput label={t("course.title")} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <TextInput label={t("course.code")} value={editCode} onChange={(e) => setEditCode(e.target.value)} />                
              </Group>

              <Group grow>
                <Select label={t("profile.major")} data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
                <TextInput label={t("course.skillTitle")} value={editSkillTitle} onChange={(e) => setEditSkillTitle(e.target.value)} />                
              </Group>

              <Textarea
                label={t("course.skillDescription")}
                value={editSkillDescription}
                onChange={(e) => setEditSkillDescription(e.target.value)}
                autosize={false}
                minRows={6}
                styles={{
                  input: {
                    height: 160, 
                  },
                }}
              />

              <Group>
                <TextInput placeholder="e.g. React" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)}/>
                <Button onClick={() => {
                  if (hardSkillInput.trim()) {
                    setHardSkills(prev => [...prev, hardSkillInput.trim()]);
                    setHardSkillInput("");
                  }
                }}>+</Button>
              </Group>
              <Group>
                {hardSkills.map((skill, i) => (
                  <Button key={i} variant="light" color="gray" onClick={() => {
                    setHardSkills(prev => prev.filter((_, idx) => idx !== i));
                  }}>{skill} ❌</Button>
                ))}
              </Group>
              <Group>
                <Button onClick={handleUpdate}>{t("update")}</Button>
                <Button color="red" variant="light" onClick={() => handleDelete(editingCourse.id)}>{t("delete")}</Button>
              </Group>
            </Stack>
          </Modal>
        </Tabs.Panel>

        {/* Create Course */}
        <Tabs.Panel value="create">
          <Paper shadow="xs" p="lg" withBorder radius="md" mt="20px">
            <Stack spacing="md">
              <Group grow>
                <TextInput label={t("course.title")} value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextInput label={t("course.code")} value={code} onChange={(e) => setCode(e.target.value)} />
              </Group>
              <Group grow>
                <Select label={t("profile.major")} data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
                <TextInput label={t("course.skillTitle")} value={skillTitle} onChange={(e) => setSkillTitle(e.target.value)} />                
              </Group>

              <Textarea 
              label={t("course.skillDescription")}  
              value={skillDescription} 
              onChange={(e) => setSkillDescription(e.target.value)}
              autosize={false}
              minRows={6}
             styles={{
                input: {
                height: 160, },
              }} />

              <Group spacing="xs" align="flex-end">
                <TextInput label={t("course.addHardSkill")} placeholder="e.g. React, Python" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
                <Button onClick={() => {
                  if (hardSkillInput.trim()) {
                    setHardSkills((prev) => [...prev, hardSkillInput.trim()]);
                    setHardSkillInput("");
                  }
                }}>+</Button>
              </Group>
              <Group spacing="xs">
                {hardSkills.map((skill, i) => (
                  <Button key={i} variant="light" size="xs" color="gray" radius="xl" onClick={() => {
                    setHardSkills((prev) => prev.filter((_, idx) => idx !== i));
                  }}>{skill} ❌</Button>
                ))}
              </Group>
              <Button fullWidth size="md" onClick={handleCreate} loading={creating}>{t("course.create")}</Button>
            </Stack>
          </Paper>
        </Tabs.Panel>

      </Tabs>
    </Box>
  );
}

