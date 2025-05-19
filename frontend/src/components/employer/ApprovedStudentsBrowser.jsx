import React, { useEffect, useState } from "react";
import {
  Box,
  TextInput,
  Button,
  Paper,
  Stack,
  Flex,
  Text,
  Modal,
  Loader,
} from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StudentWalletMini from "./StudentWalletMini";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ApprovedStudentsBrowser() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApprovedStudents();
    }
  }, [user]);

  const fetchApprovedStudents = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/admin/approved-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to fetch approved students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      setFiltered(students);
    } else {
      const results = students.filter((stu) =>
        stu.skills.some(
          (s) =>
            s.title?.toLowerCase().includes(keyword) ||
            s.courseTitle?.toLowerCase().includes(keyword)
        )
      );
      setFiltered(results);
    }
  };

  const openModal = (studentId) => {
    setSelectedId(studentId);
    setModalOpened(true);
  };

  return (
    <Box mt="md">
      <Flex gap="sm" align="flex-end">
        <TextInput
          label="Search by Skill or Course"
          placeholder="e.g. JavaScript, Design, IFN711"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Flex>

      {loading ? (
        <Loader mt="lg" />
      ) : (
        <Stack mt="md">
          {filtered.length === 0 ? (
            <Text c="dimmed">No matching students found.</Text>
          ) : (
            filtered.map((stu) => (
              <Paper key={stu.id} withBorder p="md">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fw={600}>
                      {stu.name} ({stu.customUid})
                    </Text>
                    <Text size="sm" c="dimmed">
                      {stu.email}
                    </Text>
                  </Box>
                  <Button size="xs" variant="light" onClick={() => openModal(stu.id)}>
                    View Skills
                  </Button>
                </Flex>
              </Paper>
            ))
          )}
        </Stack>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Student Skills"
        size="xl"
      >
        {selectedId ? <StudentWalletMini studentId={selectedId} /> : <Text>Loading...</Text>}
      </Modal>
    </Box>
  );
}
