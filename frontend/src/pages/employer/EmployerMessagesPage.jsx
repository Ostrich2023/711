import React, { useState } from "react";
import { Box, Grid, Card, ScrollArea, Text, Title, Button, Group, Avatar, Stack, Progress } from "@mantine/core";
import {
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandPython,
  IconBrandReact,
  IconBrandNodejs,
} from '@tabler/icons-react';

import StudentDashboard from "../../components/employer/StudentDashboard";

const bgColors = ['#71AA34', '#2E5A88', '#EAC117', '#F87217'];

const students = [
  {
    id: 1,
    name: "Samuel Robinson",
    university: "QUT",
    major: "Computer Science",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    passedCourses: ["Algorithms", "Web Development", "Data Structures"],
    techSkills: [
      { skill: "React", grade: 4 },
      { skill: "Node.js", grade: 3 },
    ],
    softSkills: [
      { skill: "Creativity", hours: 90},
      { skill: "Collaboration", hours: 130},
      { skill: "Problem Solving", hours: 5},
    ],
  },
  {
    id: 2,
    name: "Ron Lee",
    university: "UQ",
    major: "Data Science",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    passedCourses: ["Statistics", "Machine Learning", "Data Mining"],
    techSkills: [
      { skill: "Python", grade: 5 },
      { skill: "JavaScript", grade: 4 },
    ],
    softSkills: [
      { skill: "Communication", hours: 110 },
      { skill: "Critical Thinking", hours: 140 },
    ],
  },
  {
    id: 3,
    name: "Terry Gomez",
    university: "Griffith University",
    major: "Design",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
    passedCourses: ["UX Design", "Digital Media", "Creative Coding"],
    techSkills: [
      { skill: "HTML", grade: 4 },
      { skill: "CSS", grade: 5 },
    ],
    softSkills: [
      { skill: "Creativity", hours: 150 },
      { skill: "Analysis", hours: 100 },
    ],
  },
  {
    id: 4,
    name: "Alyssa Silva",
    university: "QUT",
    major: "Information Technology",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
    passedCourses: ["Full Stack Dev", "Networking", "Cyber Security"],
    techSkills: [
      { skill: "React", grade: 5 },
      { skill: "Python", grade: 4 },
      { skill: "Node.js", grade: 4 },
    ],
    softSkills: [
      { skill: "Communication", hours: 140 },
      { skill: "Collaboration", hours: 160 },
    ],
  },
  {
    id: 5,
    name: "Max Alister",
    university: "UQ",
    major: "Software Engineering",
    image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
    passedCourses: ["Software Architecture", "Databases", "Cloud Computing"],
    techSkills: [
      { skill: "JavaScript", grade: 4 },
      { skill: "HTML", grade: 5 },
      { skill: "CSS", grade: 4 },
    ],
    softSkills: [
      { skill: "Critical Thinking", hours: 150 },
      { skill: "Creativity", hours: 120 },
    ],
  },
];

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build UI components and collaborate with backend engineers.",
  },
  {
    id: 2,
    title: "Data Analyst",
    description: "Analyze data trends and create dashboards.",
  },
  {
    id: 3,
    title: "Cyber Security",
    description: "Participate in a Blockchain project.",
  },
  {
    id: 4,
    title: "Business Analyst",
    description: "Looking for a person familiar with Tableau",
  },
];

const initialMessages = [
  {
    id: 1,
    studentId: 1,
    jobId: 1,
    status: null, 
    isRead: false,
    date: "Apr 27, 2025"
  },
  {
    id: 2,
    studentId: 2,
    jobId: 2,
    status: null,
    isRead: false,
    date: "Apr 26, 2025"
  },
  {
    id: 3,
    studentId: 4,
    jobId: 3,
    status: "Accepted",
    isRead: true,
    date: "Apr 16, 2025"
  },
  {
    id: 4,
    studentId: 3,
    jobId: 4,
    status: "Accepted",
    isRead: true,
    date: "Apr 6, 2025"
  },
];


export default function EmployerMessagesPage() {
  const [messages, setMessages] = useState(() => {
    return initialMessages.map((msg) => {
      const student = students.find((s) => s.id === msg.studentId);
      const job = jobs.find((j) => j.id === msg.jobId);
      return {
        ...msg,
        name: student?.name,
        university: student?.university,
        jobTitle: job?.title,
        jobDescription: job?.description,
        student,
      };
    });
  });
  
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMessage = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    );
    setSelectedId(id);
  };

  const handleStatusChange = (id, newStatus) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      )
    );
  };

  const selectedMessage = messages.find((msg) => msg.id === selectedId);

  return (
    <Box flex={1} mt="30px" px="md" w="100%">
      <Grid gutter="md">
        {/* LEFT PANEL - Inbox */}
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Box
            bg="#2E5A88"
            h="80vh"
            p="sm"
            style={{ borderRadius: "8px", color: "white" }}
          >
            <Title order={4} mb="sm">
              Messages
            </Title>
            <ScrollArea h="70vh" type="auto">
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  mb="sm"
                  p="xs"
                  onClick={() => handleSelectMessage(msg.id)}
                  style={{
                    backgroundColor: msg.id === selectedId ? '#3A6CA0' : '#234569',
                    color: 'white',
                    borderRadius: "6px",
                    fontWeight: msg.isRead ? 400 : 600,
                    cursor: "pointer",
                    position: "relative", //To show the dot
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {!msg.isRead && (
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "white",
                      }}
                    />
                  )}

                  <Text>{`${msg.name} from ${msg.university}`}</Text>
                  <Text size="sm">{`applied for ${msg.jobTitle}`}</Text>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    

                    <Text size="xs" c="gray">{msg.date}</Text>
                    {msg.status && (
                      <Text
                        size="xs"
                        c={msg.status === "Accepted" ? "green" : "red"}
                      >
                        {msg.status}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </ScrollArea>
          </Box>
        </Grid.Col>

        {/* RIGHT PANEL - Message Details */}
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
          <Box bg="#F8F9FA" h="80vh" p="md" style={{ borderRadius: "8px" }}>
            {selectedMessage ? (
              <>
                {/* Header */}
                <Box bg="#EAC117" p="md" style={{ borderRadius: "6px", marginBottom: "16px" }}>
                  <Text fw={600}>
                    {selectedMessage.name} from {selectedMessage.university} applied for{" "}
                    {selectedMessage.jobTitle}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Sent on {selectedMessage.date}
                  </Text>
                </Box>

                {/* Job section */}
                <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
                  <Title order={4} mb="sm">Job Application</Title>

                  <Box>
                    <Text fw={700} size="sm" mb={4}>Job Title:</Text>
                    <Text size="sm" mb="sm">{selectedMessage.jobTitle}</Text>

                    <Text fw={700} size="sm" mb={4}>Description:</Text>
                    <Text size="sm">{selectedMessage.jobDescription}</Text>
                  </Box>
                </Card>

                {/* Application card placeholder */}
                <Box mt="md">
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <StudentDashboard student={selectedMessage.student} />
                  </Card>
                </Box>

                {/* Accept / Reject an Application Buttons */}
                {selectedMessage.isRead && selectedMessage.status === null && (
                  <Group mt="lg">
                    <Button
                      color="green"
                      onClick={() => handleStatusChange(selectedMessage.id, "Accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      color="red"
                      onClick={() => handleStatusChange(selectedMessage.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </Group>
                )}
              </>
            ) : (
              <Text>Select a message to view details</Text>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}