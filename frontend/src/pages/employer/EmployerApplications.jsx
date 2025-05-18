import React, { useEffect, useState } from "react";
import {
  Box,
  Title,
  Table,
  Loader,
  Modal,
  Button,
  Text,
  Group,
  Badge,
} from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import StudentWalletMini from "../../components/employer/StudentWalletMini";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmployerApplications({ jobId }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (user && jobId) {
      fetchApplications();
    }
  }, [user, jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/applications/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSkill = (application) => {
    setSelected(application);
    setOpened(true);
  };

  return (
    <Box mt="md">
      <Title order={3} mb="md">Job Applications</Title>
      {loading ? (
        <Loader />
      ) : applications.length === 0 ? (
          <TextInput
            placeholder="Search by student name or message"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            mb="md"
        />
      ) : (
        <Table striped withBorder>
            <thead>
            <tr>
                <th>Student</th>
                <th>Applied At</th>
                <th>Message</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {filteredApplications.map((app) => (
                <tr key={app.id}>
                <td>{app.studentName || "Unknown"}</td>
                <td>{format(app.appliedAt.toDate?.() || new Date(), "yyyy-MM-dd HH:mm")}</td>
                <td>{app.message || "-"}</td>
                <td>
                    <Button size="xs" onClick={() => handleViewSkill(app)}>
                    check
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
      )}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`application from ${selected?.studentName}`}
        size="xl"
      >
        {selected ? (
          <StudentWalletMini studentId={selected.studentId} />
        ) : (
          <Text>loading..</Text>
        )}
      </Modal>
    </Box>
  );
}
