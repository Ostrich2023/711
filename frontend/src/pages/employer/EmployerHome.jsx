import React, { useEffect, useState } from "react";
import {
  Box, Grid, Loader, Center, Text, Flex, RingProgress,
  Paper, Stack, TextInput, Button, Modal, Pagination
} from "@mantine/core";
import axios from "axios";

import HeaderCard from "../../components/employer/HeaderCard";
import ImagePaper from "../../components/employer/ImagePaper";
import ChartPaper from "../../components/employer/ChartPaper";
import StudentWalletMini from "../../components/employer/StudentWalletMini";
import postJobImage from "../../assets/postjob.png";

import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 5;

export default function EmployerHome() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, viewed: 0, shortlisted: 0 });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [page, setPage] = useState(1);

  const SHOW_RECENT = false;

  useEffect(() => {
    if (user) {
      loadUserData();
      fetchApplications();
      fetchApprovedStudents();
    }
  }, [user]);

  const loadUserData = async () => {
    const token = await user.getIdToken();
    const res = await axios.get(`${BASE_URL}/user/${user.uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserData(res.data);
  };

  const fetchApplications = async () => {
    const token = await user.getIdToken();
    const res = await axios.get(`${BASE_URL}/employer/recent-applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications(Array.isArray(res.data) ? res.data : []);
    const summaryRes = await axios.get(`${BASE_URL}/employer/application-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSummary(summaryRes.data || {});
    setLoading(false);
  };

  const fetchApprovedStudents = async () => {
    const token = await user.getIdToken();
    const res = await axios.get(`${BASE_URL}/employer/approved-students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = Array.isArray(res.data) ? res.data : [];
    setStudents(result);
    setFilteredStudents(result);
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredStudents(students);
      return;
    }
    const keyword = search.toLowerCase();
    const filtered = students.filter((stu) =>
      Array.isArray(stu.skills) &&
      stu.skills.some((s) =>
        s.title?.toLowerCase().includes(keyword) || s.courseTitle?.toLowerCase().includes(keyword)
      )
    );
    setFilteredStudents(filtered);
    setPage(1);
  };

  const handleView = (id) => {
    setSelectedStudentId(id);
    setOpened(true);
  };

  const paginatedStudents = Array.isArray(filteredStudents)
    ? filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : [];

  if (loading || !userData) {
    return <Center mt="lg"><Loader /></Center>;
  }

  return (
    <Box mt="md">
      <HeaderCard userData={userData} userType="employer" />

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ImagePaper
            title="Post Your Job"
            description="Attract talented students by creating a new job opportunity."
            buttonText="Post Now"
            buttonLink="/employer/request-skill"
            imageUrl={postJobImage}
          />
        </Grid.Col>

{/* <Grid.Col span={{ base: 12, md: 6 }}>
  <ChartPaper title="Application Summary">
    <Center>
      <RingProgress
        size={180}
        thickness={16}
        roundCaps
        sections={[
          { value: summary.total || 0, color: "blue", tooltip: "Total" },
          { value: summary.viewed || 0, color: "teal", tooltip: "Viewed" },
          { value: summary.shortlisted || 0, color: "orange", tooltip: "Shortlisted" },
        ]}
        label={<Text fw={700} ta="center">{summary.total || 0} Total</Text>}
      />
    </Center>
  </ChartPaper>
</Grid.Col> */}

      </Grid>

      {/* Browse Students */}
      <Paper mt="xl" p="md" radius="md" shadow="xs" withBorder>
        <Flex align="flex-end" gap="sm">
          <TextInput
            label="Search students by skill"
            placeholder="Enter keyword..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Flex>

        <Stack mt="md">
          {Array.isArray(paginatedStudents) && paginatedStudents.length > 0 ? (
            paginatedStudents.map((stu) => (
              <Paper key={stu.id} withBorder p="md">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fw={600}>{stu.name} ({stu.customUid})</Text>
                    <Text size="sm" c="dimmed">{stu.email}</Text>
                  </Box>
                  <Button variant="light" size="xs" onClick={() => handleView(stu.id)}>
                    View Skills
                  </Button>
                </Flex>
              </Paper>
            ))
          ) : (
            <Text c="dimmed">No students found.</Text>
          )}
        </Stack>

        {SHOW_RECENT && (
          <Paper mt="xl" p="md" radius="md" shadow="xs" withBorder>
            <Text fw={500} size="lg" mb="sm">Recent Applicants</Text>
            {Array.isArray(applications) && applications.length > 0 ? (
              <Stack>
                {applications.slice(0, 3).map((app) => (
                  <StudentWalletMini key={app.studentId} studentId={app.studentId} />
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">No applications found.</Text>
            )}
          </Paper>
        )}

        <Pagination
          value={page}
          onChange={setPage}
          total={Math.ceil(filteredStudents.length / PAGE_SIZE)}
          mt="md"
          size="sm"
        />
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Student Skills"
        size="xl"
      >
        {selectedStudentId && <StudentWalletMini studentId={selectedStudentId} />}
      </Modal>
    </Box>
  );
}
