import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "@mantine/carousel/styles.css"

// Frontend-Amir
import { Container, Group, Text, Grid, Box, Paper, Flex, Button} from "@mantine/core";
import { createTheme, useMantineTheme, MantineProvider } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import cx from "clsx";
import dayjs from "dayjs";





import classes from "./EmployerPage.module.css";
import HeaderCard from "../../components/employer/HeaderCard"
import ImagePaper from "../../components/employer/ImagePaper";
import ChartPaper from "../../components/employer/ChartPaper";
import CardScroll from "../../components/employer/CardScroll";
import StudentCard from "../../components/employer/StudentCard";
import PostJob_img from "../../../public/favicon.ico"
import { Link } from "react-router-dom";

const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [classes.responsiveContainer]: size === "responsive" })
      })
    })
  }
});
// Frontend-Amir

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function EmployerHome(){
  
  const studentsData = [
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

  const jobAds = [
    { value: "1", label: 'Frontend Developer' },
    { value: "2", label: 'Data Analyst' },
    { value: "3", label: 'Backend Developer' },
    { value: "4", label: 'UX Designer' },
    { value: "5", label: 'Project Manager' },
    { value: "6", label: 'Marketing Specialist' },
  ];

  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [skills, setSkills] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState({});
  const [openedModalId, setOpenedModalId] = useState(null);

  const handleJobChange = (studentId, job) => {
    setAssignedJobs((prev) => ({ ...prev, [studentId]: job }));
  };

  // ❗ Block unauthorized access
  if (!user || role !== "employer") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchSchoolList();
  }, []);

  const fetchSchoolList = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/schools`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchools(res.data);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      alert("Could not load school list");
    }
  };

  const fetchStudents = async (schoolId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/school/${schoolId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedSchool(schoolId);
      setStudents(res.data);
      setSelectedStudent(null);
      setSkills([]);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      alert("Could not load students from this school");
    }
  };

  const fetchSkills = async (studentId) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/employer/student/${studentId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentInfo = students.find((s) => s.id === studentId);
      setSelectedStudent(studentInfo);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch student skills:", error);
      alert("Could not load skills");
    }
  };

  // Frontend-Amir
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)


  // Employer data for Header
  const employerData = {
    id: user?.email || "EM123456",
    name: user?.username || "Alice Smith",
    company: "Mindstormers",
    role: role,
    image: user?.ImageUrl ||
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png"
  }

  // Messages data
  const messages = [
    {
      id: 1,
      studentName: "Alice Johnson",
      school: "QUT",
      jobTitle: "Software Developer Intern",
      dateSent: "2025-04-25"
    },
    {
      id: 2,
      studentName: "Bob Smith",
      school: "UQ",
      jobTitle: "Data Analyst Intern",
      dateSent: "2025-04-26"
    },
    {
      id: 3,
      studentName: "Clara Lee",
      school: "Griffith University",
      jobTitle: "Frontend Developer",
      dateSent: "2025-04-2"
    },
    {
      id: 4,
      studentName: "Clara Lee",
      school: "Griffith University",
      jobTitle: "Frontend Developer",
      dateSent: "2025-04-7"
    },
    {
      id: 5,
      studentName: "Clara Lee",
      school: "Griffith University",
      jobTitle: "Frontend Developer",
      dateSent: "2025-04-17"
    },
    {
      id: 6,
      studentName: "Clara Lee",
      school: "Griffith University",
      jobTitle: "Frontend Developer",
      dateSent: "2025-04-21"
    },
    {
      id: 7,
      studentName: "Clara Lee",
      school: "Griffith University",
      jobTitle: "Frontend Developer",
      dateSent: "2025-04-27"
    }
  ]

  const ApplicationData = [
    { status: "New", count: 10, color: "#9CD3E8" },
    { status: "Viewed", count: 20, color: "#F39393" },
    { status: "Shortlisted", count: 2, color: "#FBD889" }
  ]
  // Frontend-Amir
  return (
    // Frontend-Amir
    <Box flex={1} mt="30px">
      <MantineProvider theme={theme}>
        <Container bg="var(--mantine-color-white)">
          <Grid justify="center" gutter="lg">
            
            {/* Heading component (Profile)*/}
            <Grid.Col span={12}>
            <HeaderCard userType="employer" userData={employerData}/>
            </Grid.Col>

            {/* Features like posting job and a dashboard of the summary of application*/}
            <Grid.Col span={12} className={classes.heading}>
              Features
            </Grid.Col>

            {/* Post a job */}
            <Grid.Col span={12}>
              <ImagePaper 
              title="Need a helping hand?"
              description="Post your job and connect with talented students eager to grow."
              buttonText="Post a Job"
              buttonLink="/post-job"
              imageUrl={PostJob_img}
              />
            </Grid.Col>

            {/* Application Summary with Chart */}
            <Grid.Col span={12}>
              <ChartPaper data={ApplicationData} />
            </Grid.Col>

            {/* Messages List */}
            <Grid.Col span={12}>
              <CardScroll
          title="Messages"
          data={messages}
          sortBy="dateSent"
          showAllLink="/messages"
          renderItem={(msg) => (
            <Group position="apart">
              <Text>
                The student <strong>{msg.studentName}</strong> from{" "}
                <strong>{msg.school}</strong> applied for the role{" "}
                <strong>{msg.jobTitle}</strong>.
              </Text>
              <Text size="sm" c="dimmed">
                {dayjs(msg.dateSent).format("MMM DD, YYYY")}
              </Text>
            </Group>
          )}
        />
            </Grid.Col>

            {/* Students List */}
            <Grid.Col span={12}>
              <Paper p="lg" radius="md" shadow="sm" withBorder>
                <Flex justify="space-between" align="center" mb="lg">
                  <div className={classes.heading}>Students</div>
                  <Button
                    onClick={() => navigate("students-list")}
                    mr="sm"
                    className={classes.actionButton}
                  >
                    Show all
                  </Button>
                </Flex>

                <Carousel
                  withControls
                  withIndicators
                  slideSize={{ base: "100%", md: "50%", lg: "50%" }}
                  slideGap="xl"
                  align="start"
                  slidesToScroll={{ sm: 1, md: 2, lg: 5 }}
                  classNames={{ indicator: classes.indicator, control: classes.control }}
                  style={{ paddingBottom: "40px" }}
                >
                  {studentsData.map((student) => (
                    <Carousel.Slide key={student.id}>
                      <StudentCard
                        {...student}
                        setOpenedModalId={setOpenedModalId}
                        openedModalId={openedModalId}
                        jobOptions={jobAds}  
                        assignedJobs={assignedJobs}
                        handleJobChange={handleJobChange}
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </MantineProvider>
    </Box>

    // Frontend-Amir

  );
};