import { Box, Title, Text, Group, Badge, Stack, Loader, Center } from "@mantine/core";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentWalletMini = ({ studentId }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && studentId) {
      fetchSkills();
    }
  }, [user, studentId]);

  const fetchSkills = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/student/${studentId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 只展示已认证的技能
      setSkills(res.data.filter((s) => s.verified === "approved"));
    } catch (err) {
      console.error("Failed to fetch student skills:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center>
        <Loader size="sm" />
      </Center>
    );
  }

  return (
    <Box mt="sm">
      <Title order={5}>Verified Skills</Title>
      {skills.length === 0 ? (
        <Text size="sm" c="dimmed">No verified skills found.</Text>
      ) : (
        <Stack spacing="sm">
          {skills.map((skill) => (
            <Box key={skill.id}>
              <Group justify="space-between">
                <Text fw={500}>{skill.title}</Text>
                <Badge color="green">Verified</Badge>
              </Group>
              <Text size="sm" c="dimmed">{skill.courseCode} - {skill.courseTitle}</Text>
              <Text size="sm">Level: {skill.level}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

StudentWalletMini.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default StudentWalletMini;
