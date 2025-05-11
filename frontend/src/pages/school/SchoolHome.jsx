import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Title, Text, Group, Loader, Center } from "@mantine/core";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import Notification from "../../components/Notification";
import UserTable from "../../components/UserTable";
import ActivityList from "../../components/ActivityList";

export default function SchoolHome() {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  const [courseData, setCourseData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [pendingSkillCount, setPendingSkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.schoolId) {
      loadSchoolData(userData.schoolId);
    }
  }, [userData]);

  const loadSchoolData = async (schoolId) => {
    try {
      // 获取该学校下的所有课程
      const courseSnap = await getDocs(
        query(collection(db, "courses"), where("schoolId", "==", schoolId))
      );

      const courseList = [];

      for (const courseDoc of courseSnap.docs) {
        const courseData = courseDoc.data();
        const courseId = courseDoc.id;

        // 获取该课程的所有技能记录
        const skillSnap = await getDocs(
          query(collection(db, "skills"), where("courseId", "==", courseId))
        );

        const uniqueStudentIds = new Set();
        skillSnap.forEach(doc => {
          const data = doc.data();
          if (data.ownerId) uniqueStudentIds.add(data.ownerId);
        });

        courseList.push({
          courseName: courseData.title,
          courseCode: courseData.code,
          students: uniqueStudentIds.size,
          assignments: skillSnap.size
        });
      }

      setCourseData(courseList);

      // 获取该学校下的所有学生
      const studentSnap = await getDocs(
        query(collection(db, "users"), where("schoolId", "==", schoolId), where("role", "==", "student"))
      );

      const studentList = studentSnap.docs.map(doc => {
        const d = doc.data();
        return {
          avatar: d.avatar || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
          name: d.name || "Unnamed",
          email: d.email,
          course: d.course || "N/A",
          lastActive: "Recently"
        };
      });
      setStudentList(studentList);

      // 获取该学校下状态为 pending 的技能记录数量
      const skillSnap = await getDocs(
        query(collection(db, "skills"), where("verified", "==", "pending"))
      );
      const count = skillSnap.docs.filter(doc => doc.data().schoolId === schoolId).length;
      setPendingSkillCount(count);
    } catch (err) {
      console.error("Failed to load school data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} mt="30px">
      {isLoading || loading ? (
        <Center mt="lg"><Loader /></Center>
      ) : (
        <>
          <Group>
            <Title order={2}>Welcome back, {userData?.name}</Title>
            <Text mt="10px" c="gray">
              {userData?.schoolId?.toUpperCase()} · {userData?.role}
            </Text>
          </Group>

          <Notification
            count={pendingSkillCount}
            label="skill submissions"
            messagePrefix="You currently have"
            messageSuffix="ready for review and certification."
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <ActivityList courseData={courseData} />
            <UserTable title="My Students" data={studentList} />
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
