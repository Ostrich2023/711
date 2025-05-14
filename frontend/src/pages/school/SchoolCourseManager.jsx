import React, { useEffect, useState } from "react";
import {
<<<<<<< HEAD
    Box,
    TextInput,
    Textarea,
    Button,
    Paper,
    Title,
    Stack,
    Group,
    Loader,
    Select,
    Modal,
    MultiSelect,
    Grid,
    Center
=======
  Box,
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Loader,
  Select,
  Modal,
>>>>>>> main
} from "@mantine/core";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import ActivityList from "../../components/ActivityList";

export default function SchoolCourseManager() {
<<<<<<< HEAD
    const { user } = useAuth();
    const { isLoading } = useFireStoreUser(user);
    const [form, setForm] = useState({
        title: "",
        code: "",
        skillTitle: "",
        skillDescription: "",
    });
    const [selectedMajor, setSelectedMajor] = useState("");
    const [courseList, setCourseList] = useState([]);
    const [majors, setMajors] = useState([]);
    const [softSkillOptions, setSoftSkillOptions] = useState([]);
    const [selectedSoftSkills, setSelectedSoftSkills] = useState([]);
    const [hardSkills, setHardSkills] = useState([]);
    const [hardSkillInput, setHardSkillInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCourses();
            fetchMajors();
            fetchSoftSkills();
=======
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    code: "",
    skillTitle: "",
    skillDescription: "",
  });
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
      alert("All fields (including major) are required.");
      return;
    }

    try {
      setCreating(true);
      const token = await user.getIdToken();
      await axios.post(
        `${BASE_URL}/course/create`,
        {
          title,
          code,
          major: selectedMajor,
          skillTemplate: {
            skillTitle,
            skillDescription,
          },
          hardSkills,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Course created successfully.");
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
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(`${BASE_URL}/course/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course deleted.");
      loadCourses();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete course.");
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      code: course.code,
      skillTitle: course.skillTemplate?.skillTitle || "",
      skillDescription: course.skillTemplate?.skillDescription || ""
    });
    setSelectedMajor(course.major?.id || "");
    setHardSkills(course.hardSkills || []);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const { title, code, skillTitle, skillDescription } = form;
    if (!title || !code || !skillTitle || !skillDescription || !selectedMajor) {
      alert("All fields (including major) are required.");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.put(
        `${BASE_URL}/course/update/${editingCourse.id}`,
        {
          title,
          code,
          major: selectedMajor,
          skillTemplate: {
            skillTitle,
            skillDescription,
          },
          hardSkills,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
>>>>>>> main
        }
      );
      alert("Course updated successfully.");
      setEditModalOpen(false);
      setEditingCourse(null);
      loadCourses();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update course.");
    }
  };

<<<<<<< HEAD
    const fetchCourses = async () => {
        try {
            const token = await user.getIdToken();
            const res = await axios.get(`${BASE_URL}/teacher/my-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourseList(res.data);
        } catch (err) {
            console.error("Failed to load courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMajors = async () => {
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

    const fetchSoftSkills = async () => {
        try {
            const token = await user.getIdToken();
            const res = await axios.get(`${BASE_URL}/course/soft-skills`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSoftSkillOptions(res.data.map(s => ({ value: s.id, label: s.name })));
        } catch (err) {
            console.error("Failed to load soft skills:", err);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = async () => {
        const { title, code, skillTitle, skillDescription } = form;
        if (!title || !code || !skillTitle || !skillDescription || !selectedMajor) {
            alert("All fields (including major) are required.");
            return;
        }

        try {
            setCreating(true);
            const token = await user.getIdToken();
            await axios.post(
                `${BASE_URL}/course/create`,
                {
                    title,
                    code,
                    major: selectedMajor,
                    skillTemplate: {
                        skillTitle,
                        skillDescription,
                        softSkills: selectedSoftSkills,
                        hardSkills: hardSkills
                    },
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Course created successfully.");
            setForm({ title: "", code: "", skillTitle: "", skillDescription: "" });
            setSelectedMajor("");
            setSelectedSoftSkills([]);
            setHardSkills([]);
            setHardSkillInput("");
            fetchCourses();
        } catch (err) {
            console.error("Course creation failed:", err);
            alert("Failed to create course.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const token = await user.getIdToken();
            await axios.delete(`${BASE_URL}/course/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Course deleted.");
            fetchCourses();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete course.");
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setForm({
            title: course.title,
            code: course.code,
            skillTitle: course.skillTemplate?.skillTitle || "",
            skillDescription: course.skillTemplate?.skillDescription || ""
        });
        setSelectedMajor(course.major?.id || "");
        setSelectedSoftSkills(course.skill?.softSkills || []);
        setHardSkills(course.skill?.hardSkills || []);
        setEditModalOpen(true);
    };

    const handleUpdate = async () => {
        const { title, code, skillTitle, skillDescription } = form;
        if (!title || !code || !skillTitle || !skillDescription || !selectedMajor) {
            alert("All fields (including major) are required.");
            return;
        }

        try {
            const token = await user.getIdToken();
            await axios.put(
                `${BASE_URL}/course/update/${editingCourse.id}`,
                {
                    title,
                    code,
                    major: selectedMajor,
                    skillTemplate: {
                        skillTitle,
                        skillDescription,
                        softSkills: selectedSoftSkills,
                        hardSkills: hardSkills
                    },
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Course updated successfully.");
            setEditModalOpen(false);
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update course.");
        }
    };

    return (
    <Box mt="30px">
        {isLoading || loading ? (
        <Center mt="lg">
            <Loader />
        </Center>
        ) : (
        <>
            {/* Course Management */}
            <Paper shadow="xs" p="md" withBorder mb="xl">
            <Title order={3} mb="md">Course Management</Title>
            <Stack>
                <Grid gutter="md">
                <Grid.Col span={6}>
                    <TextInput label="Course Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput label="Course Code" value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Select label="Major" data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput label="Skill Title (Template)" value={form.skillTitle} onChange={(e) => handleChange("skillTitle", e.target.value)} />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Textarea label="Skill Description" value={form.skillDescription} onChange={(e) => handleChange("skillDescription", e.target.value)} />
                </Grid.Col>

                <Grid.Col span={12}>
                    <MultiSelect label="Soft Skills" data={softSkillOptions} value={selectedSoftSkills} onChange={setSelectedSoftSkills} />
                </Grid.Col>

                <Grid.Col span={9}>
                    <TextInput label="Add Hard Skill" placeholder="e.g., JavaScript" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button fullWidth mt={24} onClick={() => {
                    if (hardSkillInput.trim()) {
                        setHardSkills(prev => [...prev, hardSkillInput.trim()]);
                        setHardSkillInput("");
                    }
                    }}>Add</Button>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group>
                    {hardSkills.map((skill, i) => (
                        <Button key={i} variant="light" color="gray" onClick={() => {
                        setHardSkills(prev => prev.filter((_, idx) => idx !== i));
                        }}>{skill} ❌</Button>
                    ))}
                    </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Button onClick={handleCreate} loading={creating} fullWidth>
                    Create Course
                    </Button>
                </Grid.Col>
                </Grid>
            </Stack>
            </Paper>

            {/* My Courses */}
            <ActivityList courseList={courseList} />
        </>
        )}

        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Course" centered>
        <Stack>
            <TextInput label="Course Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
            <TextInput label="Course Code" value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
            <Select label="Major" data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
            <TextInput label="Skill Title (Template)" value={form.skillTitle} onChange={(e) => handleChange("skillTitle", e.target.value)} />
            <Textarea label="Skill Description" value={form.skillDescription} onChange={(e) => handleChange("skillDescription", e.target.value)} />
            <MultiSelect label="Soft Skills" data={softSkillOptions} value={selectedSoftSkills} onChange={setSelectedSoftSkills} />
            
            <Group>
            <TextInput label="Add Hard Skill" placeholder="e.g., JavaScript" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
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

            <Button onClick={handleUpdate}>Update Course</Button>
        </Stack>
        </Modal>
    </Box>
    );
}
=======
  return (
    <Box mt="30px">
      <Title order={2} mb="lg">Course Management</Title>

      <Paper shadow="xs" p="md" withBorder mb="xl">
        <Stack>
          <TextInput label="Course Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
          <TextInput label="Course Code" value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
          <Select label="Major" data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
          <TextInput label="Skill Title (Template)" value={form.skillTitle} onChange={(e) => handleChange("skillTitle", e.target.value)} />
          <Textarea label="Skill Description" value={form.skillDescription} onChange={(e) => handleChange("skillDescription", e.target.value)} />
          <Group>
            <TextInput label="Add Hard Skill" placeholder="e.g., JavaScript" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
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
          <Button onClick={handleCreate} loading={creating}>Create Course</Button>
        </Stack>
      </Paper>

      <Title order={3} mb="md">Your Courses</Title>
      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <Text>No courses created yet.</Text>
      ) : (
        courses.map((course) => (
          <Paper key={course.id} p="md" radius="md" withBorder mb="md">
            <Group position="apart">
              <Box>
                <Text fw={500}>{course.title}</Text>
                <Text size="sm" c="gray">{course.code}</Text>
                <Text size="sm" mt="xs">Skill: {course.skillTemplate?.skillTitle}</Text>
                <Text size="sm" c="dimmed">{course.skillTemplate?.skillDescription}</Text>
              </Box>
              <Group>
                <Button variant="light" onClick={() => openEditModal(course)}>Edit</Button>
                <Button color="red" variant="light" onClick={() => handleDelete(course.id)}>Delete</Button>
              </Group>
            </Group>
          </Paper>
        ))
      )}

      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Course" centered>
        <Stack>
          <TextInput label="Course Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
          <TextInput label="Course Code" value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
          <Select label="Major" data={majors.map((m) => ({ value: m.id, label: m.name }))} value={selectedMajor} onChange={setSelectedMajor} />
          <TextInput label="Skill Title (Template)" value={form.skillTitle} onChange={(e) => handleChange("skillTitle", e.target.value)} />
          <Textarea label="Skill Description" value={form.skillDescription} onChange={(e) => handleChange("skillDescription", e.target.value)} />
          <Group>
            <TextInput label="Add Hard Skill" placeholder="e.g., React" value={hardSkillInput} onChange={(e) => setHardSkillInput(e.target.value)} />
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
          <Button onClick={handleUpdate}>Update Course</Button>
        </Stack>
      </Modal>
    </Box>
  );
}
>>>>>>> main
