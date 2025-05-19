import { Box, Title, Text, Loader, Center } from "@mantine/core";
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

      const skillList = Array.isArray(res.data) ? res.data : [];
      setSkills(skillList.filter((s) => s.verified === "approved"));
    } catch (err) {
      console.error("Failed to fetch student skills:", err);
      setSkills([]);
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
      <Title order={5} mb="xs">Verified Skills</Title>
      {skills.length === 0 ? (
        <Text size="sm" c="dimmed">No verified skills found.</Text>
      ) : (
        <Stack spacing="sm">
          {skills.map((skill) => {
            const soft = skill.softSkillScores || {};
            const hard = skill.hardSkillScores || {};

            const totalSoft = Object.values(soft).reduce((sum, val) => sum + val, 0);
            const totalHard = Object.values(hard).reduce((sum, val) => sum + val, 0);
            const total = totalSoft + totalHard;
            const max = (Object.keys(soft).length + Object.keys(hard).length) * 5;

            return (
              <Box key={skill.id} p="sm" withBorder radius="md">
                <Text fw={600} size="md">
                  {skill.title} ({skill.courseTitle})
                </Text>
                <Text size="sm" c="dimmed">{skill.description}</Text>

                {skill.attachmentCid && (
                  <Text size="sm" mt="xs">
                    Attachment:{" "}
                    <a
                      href={`https://ipfs.io/ipfs/${skill.attachmentCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </Text>
                )}

                {/* 技术技能评分 */}
                {Object.keys(hard).length > 0 && (
                  <>
                    <Text fw={500} mt="sm">Hard Skill Scores:</Text>
                    <ul style={{ marginLeft: "1.2rem" }}>
                      {Object.entries(hard).map(([name, val]) => (
                        <li key={name}>
                          <Text size="sm">{name}: {val} / 5</Text>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* 软技能评分 */}
                {Object.keys(soft).length > 0 && (
                  <>
                    <Text fw={500} mt="sm">Soft Skill Scores:</Text>
                    <ul style={{ marginLeft: "1.2rem" }}>
                      {Object.entries(soft).map(([name, val]) => (
                        <li key={name}>
                          <Text size="sm">{name}: {val} / 5</Text>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <Text mt="xs" fw={600} c="blue">
                  Total Score: {total} / {max}
                </Text>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

StudentWalletMini.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default StudentWalletMini;
