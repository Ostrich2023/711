import React, { useEffect, useState } from "react";
import {
  Box, TextInput, Textarea, Button, Paper, Title, Stack,
  Group, Text, Loader, Select, Modal, Tabs
} from "@mantine/core";
import axios from "axios";
import classes from "../../style/SchoolCourseManager.module.css"
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SchoolCourseManager() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", code: "", skillTitle: "", skillDescription: "" });
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    const { title, code, skillTitle, skillDescription } = form;
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
      setForm({ title: "", code: "", skillTitle: "", skillDescription: "" });
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

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      code: course.code,
      skillTitle: course.skillTemplate?.skillTitle || "",
      skillDescription: course.skillTemplate?.skillDescription || "",
    });
    setSelectedMajor(course.major?.id || "");
    setHardSkills(course.hardSkills || []);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const { title, code, skillTitle, skillDescription } = form;
    if (!title || !code || !skillTitle || !skillDescription || !selectedMajor) {
      alert(t("request.noMajor"));
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.put(`${BASE_URL}/course/update/${editingCourse.id}`, {
        title,
        code,
        major: selectedMajor,
        skillTemplate: { skillTitle, skillDescription },
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

  return (
    <Box mt="30px">
      <Title order={2}>{t("navbar.courses")}</Title>

      <Tabs radius="md" defaultValue="create" mt="20px">
        <Tabs.List>
          <Tabs.Tab value="create"  style={{ fontSize: 16, fontWeight: 600 }}>{t("course.create")}</Tabs.Tab>
          <Tabs.Tab value="list"  style={{ fontSize: 16, fontWeight: 600 }}>{t("course.manage")}</Tabs.Tab>
        </Tabs.List>

        {/* Add a course */}
        <Tabs.Panel value="create">
          <Paper shadow="xs" p="lg" withBorder radius="md" mt="20px">
            <Stack spacing="md">
              <Group grow>
                <TextInput
                  label={t("course.title")}
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
                <TextInput
                  label={t("course.code")}
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                />
              </Group>

              <Select
                label={t("profile.major")}
                data={majors.map((m) => ({ value: m.id, label: m.name }))}
                value={selectedMajor}
                onChange={setSelectedMajor}
              />

              <Group grow>
                <TextInput
                  label={t("course.skillTitle")}
                  value={form.skillTitle}
                  onChange={(e) => handleChange("skillTitle", e.target.value)}
                />
              </Group>

              <Textarea
                label={t("course.skillDescription")}
                minRows={3}
                value={form.skillDescription}
                onChange={(e) => handleChange("skillDescription", e.target.value)}
              />

              <Group spacing="xs" align="flex-end">
                <TextInput
                  label={t("course.addHardSkill")}
                  placeholder="e.g. React, Python"
                  value={hardSkillInput}
                  onChange={(e) => setHardSkillInput(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (hardSkillInput.trim()) {
                      setHardSkills((prev) => [...prev, hardSkillInput.trim()]);
                      setHardSkillInput("");
                    }
                  }}
                >
                  +
                </Button>
              </Group>

              <Group spacing="xs">
                {hardSkills.map((skill, i) => (
                  <Button
                    key={i}
                    variant="light"
                    size="xs"
                    color="gray"
                    radius="xl"
                    onClick={() => {
                      setHardSkills((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                  >
                    {skill} ❌
                  </Button>
                ))}
              </Group>

              <Button fullWidth size="md" onClick={handleCreate} loading={creating}>
                {t("course.create")}
              </Button>
            </Stack>
          </Paper>        
        </Tabs.Panel>

        { /* Course List */}
        <Tabs.Panel value="list">
          {loading ? (
            <Loader />
          ) : courses.length === 0 ? (
            <Text>{t("course.noCourses")}</Text>
          ) : (
            <Box>
              {courses.map((course, i) => (
                <Box key={course.id} py="sm" px="md" className={classes.course} onClick={() => openEditModal(course)}>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={500}>{course.title}</Text>
                    <Text size="sm" c="gray">{course.code}</Text>
                    <Text size="sm" mt="xs">{t("course.skill")}: {course.skillTemplate?.skillTitle}</Text>
                    <Text size="sm" c="dimmed">{course.skillTemplate?.skillDescription}</Text>
                  </Box>

                  {/* 这部分删除，把按钮挪到modal里 在modal里实现edit/delete功能 */}
                  <Group spacing="xs" mt="xs">                   
                    <Button variant="light" >{t("edit")}</Button>
                    <Button color="red" variant="light" onClick={() => handleDelete(course.id)}>{t("delete")}</Button>
                  </Group>
                </Box>
              ))}
            </Box>
          )}

          <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title={t("course.edit")} centered>
            <Stack>
              <TextInput label={t("course.title")} value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
              <TextInput label={t("course.code")} value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
              <Select label={t("profile.major")} data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
              <TextInput label={t("course.skillTitle")} value={form.skillTitle} onChange={(e) => handleChange("skillTitle", e.target.value)} />
              <Textarea label={t("course.skillDescription")} value={form.skillDescription} onChange={(e) => handleChange("skillDescription", e.target.value)} />
              <Group>
                <TextInput placeholder="e.g. React" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
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
              <Button color="red" variant="light" onClick={() => handleDelete(course.id)}>{t("delete")}</Button>                
              </Group>
            </Stack>
          </Modal>        
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

