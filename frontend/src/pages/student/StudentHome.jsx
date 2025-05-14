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

export default function StudentHome() {
  const { user } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);

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

      // Extract unique courseIds
      const courseIds = [...new Set(skillData.map(s => s.courseId))];

      const courseData = [];
      const teacherMap = {};

      for (const courseId of courseIds) {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          const course = courseDoc.data();
          course.id = courseDoc.id;

          // fetch teacher
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
            <Title order={2}>Welcome back, {userData?.name}</Title>
            <Text c="dimmed">{userData?.schoolId?.toUpperCase()} · Student</Text>
          </Group>

          {/* Skills Overview */}
          <Title order={3} mt="md" mb="sm">My Skills</Title>
          {skills.length === 0 ? (
            <Text>No skills submitted yet.</Text>
          ) : (
            <Stack>
              {skills.map(skill => (
                <Paper key={skill.id} withBorder p="md">
                  <Group justify="space-between">
                    <Box>
                      <Text fw={600}>{skill.title} ({skill.level})</Text>
                      <Text size="sm" c="dimmed">
                        {skill.courseCode} - {skill.courseTitle}
                      </Text>
                      <Text size="xs" mt="xs">{skill.description}</Text>
                      {skill.verified === "approved" ? (
                        <Badge color="green">Approved</Badge>
                      ) : skill.verified === "rejected" ? (
                        <Badge color="red">Rejected</Badge>
                      ) : (
                        <Badge color="gray">Pending</Badge>
                      )}
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}

          {/* Courses */}
          <Title order={3} mt="xl" mb="sm">My Courses</Title>
          {courses.length === 0 ? (
            <Text>No course participation detected.</Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {courses.map(course => (
                <Paper key={course.id} withBorder p="md">
                  <Text fw={600}>{course.title}</Text>
                  <Text size="sm" c="dimmed">{course.code}</Text>
                  <Text size="xs" mt="xs">{course.skillTemplate?.skillDescription}</Text>
                  <Text size="xs" mt="xs">
                    Teacher: {teachers[course.id]?.name || "Unknown"}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Box>
  );
}
