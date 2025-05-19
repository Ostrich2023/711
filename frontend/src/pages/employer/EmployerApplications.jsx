import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Loader,
  Center,
  Table,
  Button,
  Modal,
  Stack,
  TextInput,
  Group,
  Textarea
} from "@mantine/core";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import StudentWalletMini from "../../components/employer/StudentWalletMini";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmployerApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/recent-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSkill = (app) => {
    setSelectedApplication(app);
    setSkillModalOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    try {
      const token = await user.getIdToken();
      await axios.patch(`${BASE_URL}/employer/applications/${selectedApplication.id}`, {
        status,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRejectOpen(false);
      setInviteOpen(false);
      setSkillModalOpen(false);
      setNote("");
      fetchApplications();
    } catch (err) {
      console.error("Failed to update application:", err);
    }
  };

  const filteredApplications = applications.filter((app) =>
    app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    app.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Text fw={600} size="xl" mb="sm">Recent Applications</Text>

      {loading ? (
        <Center mt="lg">
          <Loader />
        </Center>
      ) : applications.length === 0 ? (
        <Text c="dimmed">No applications found.</Text>
      ) : (
        <>
          <TextInput
            placeholder="Search by student name or message"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            mb="md"
          />

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
                  <td>{format(app.appliedAt?.toDate?.() || new Date(), "yyyy-MM-dd HH:mm")}</td>
                  <td>{app.message || "-"}</td>
                  <td>
                    <Button size="xs" onClick={() => handleViewSkill(app)}>
                      Check
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* 查看技能 Snapshot + 操作按钮 */}
      <Modal
        opened={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title="Student Skill Snapshot"
        size="xl"
      >
        {selectedApplication && (
          <Stack>
            <StudentWalletMini studentId={selectedApplication.studentId} />

            <Group grow>
              <Button color="red" onClick={() => setRejectOpen(true)}>Reject</Button>
              <Button color="blue" onClick={() => setInviteOpen(true)}>Invite</Button>
              <Button color="green" onClick={() => handleStatusUpdate("accepted")}>Accept</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* 拒绝理由弹窗 */}
      <Modal
        opened={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Application"
        centered
      >
        <Textarea
          label="Reason"
          placeholder="Enter reason for rejection"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
          mb="sm"
        />
        <Button color="red" onClick={() => handleStatusUpdate("rejected")}>Confirm Reject</Button>
      </Modal>

      {/* 面试邀请弹窗 */}
      <Modal
        opened={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite to Interview"
        centered
      >
        <Textarea
          label="Invitation Message"
          placeholder="Enter interview details"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
          mb="sm"
        />
        <Button color="blue" onClick={() => handleStatusUpdate("interview")}>Send Invitation</Button>
      </Modal>
    </Box>
  );
}
