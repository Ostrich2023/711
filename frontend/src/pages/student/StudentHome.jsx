import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Text,
  Group,
  Loader,
  Center,
  Paper,
  Stack,
  Badge,
  SimpleGrid,
  Alert
} from "@mantine/core";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";
import { useTranslation } from "react-i18next";
import { IconInfoCircle } from "@tabler/icons-react";
import Notification from "../../components/Notification";

export default function StudentHome() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.uid && userData?.schoolId) {
      fetchStudentSkills();
    }
  }, [user, userData]);

  const fetchStudentSkills = async () => {
    try {
      const skillSnap = await getDocs(
        query(collection(db, "skills"), where("ownerId", "==", user.uid))
      );
      const skillData = skillSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSkills(skillData);
      setPendingCount(skillData.filter(s => s.verified === "pending").length);

      const courseIds = [...new Set(skillData.map(s => s.courseId))];
      const courseData = [];
      const teacherMap = {};

      for (const courseId of courseIds) {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          const course = courseDoc.data();
          course.id = courseDoc.id;

          const teacherRef = course.createdBy;
          if (teacherRef && teacherRef.path) {
            const teacherDoc = await getDoc(teacherRef);
            if (teacherDoc.exists()) {
              teacherMap[course.id] = teacherDoc.data();
            }
          }

          courseData.push(course);
        }
      }

      setCourses(courseData);
      setTeachers(teacherMap);
    } catch (err) {
      console.error("Failed to load skills or courses:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} mt="30px">
      {isLoading || loading ? (
        <Center mt="xl">
          <Loader />
        </Center>
      ) : (
        <>
          <Group mb="sm">
            <Title order={2}>
              {t("welcome")}, {userData?.name}
            </Title>

            {/* ✅ 修复后的 Notification */}
            <Notification
              count={pendingCount}
              label="student.skillLabel"
              messagePrefix="student.reviewPrefix"
              messageSuffix="student.reviewSuffix"
            />

            <Text c="dimmed">
              {userData?.schoolId?.toUpperCase()} · {t("student")}
            </Text>
          </Group>

          {/* 可选：保留原 Alert */}
          {pendingCount > 0 && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title={t("student.pendingSkillsMessage", { count: pendingCount })}
              color="blue"
              mt="md"
            />
          )}

          <Title order={3} mt="md" mb="sm">{t("mySkills")}</Title>
          {skills.length === 0 ? (
            <Text>{t("noSkillsYet")}</Text>
          ) : (
            <SimpleGrid cols={2} spacing="md">
              {skills.map(skill => (
                <Paper key={skill.id} withBorder p="md" radius="md">
                  <Stack spacing="xs">
                    <Group justify="space-between">
                      <Text fw={500}>{skill.title}</Text>
                      <Badge color={skill.verified === "approved" ? "green" : "gray"}>
                        {skill.verified}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{skill.courseCode} - {skill.courseTitle}</Text>
                    <Text size="sm">{t("level")}: {skill.level}</Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          )}

          <Title order={3} mt="xl" mb="sm">{t("myCourses")}</Title>
          {courses.length === 0 ? (
            <Text>{t("noCourses")}</Text>
          ) : (
            <Stack>
              {courses.map(course => (
                <Paper key={course.id} withBorder p="md">
                  <Text fw={500}>{course.title}</Text>
                  <Text size="sm" c="dimmed">{course.code}</Text>
                  <Text size="sm">{t("teacher")}: {teachers[course.id]?.name || "Unknown"}</Text>
                </Paper>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
