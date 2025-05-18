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

import StatusOverview from "../../components/StatusOverview"
import ActivityList from "../../components/ActivityList";

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
            <Text c="dimmed">{userData?.schoolId?.toUpperCase()} · {t("student")}</Text>
          </Group>

          {pendingCount > 0 && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title={t("student.pendingSkillsMessage", { count: pendingCount })}
              color="blue"
              mt="md"
            />
          )}

          <StatusOverview skills={skills}/>

          <ActivityList courseList={courses}/>
        </>
      )}
    </Box>
  );
}