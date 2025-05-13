import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Title, Text, Group, Loader, Center } from "@mantine/core";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useFireStoreUser } from "../../hooks/useFirestoreUser";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import Notification from "../../components/Notification";
import UserTable from "../../components/UserTable";
import ActivityList from "../../components/ActivityList";

export default function SchoolHome() {
  const { user } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  const [courseList, setCourseList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [pendingSkillCount, setPendingSkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user){
      fetchCourses()
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/teacher/my-courses`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setCourseList(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  }

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
            <ActivityList courseList={courseList} />
            <UserTable title="My Students" data={studentList} />
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
