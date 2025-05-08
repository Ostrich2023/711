import React, { useEffect, useState } from "react";
import { Container, Group, Box,Flex, SimpleGrid ,Title, Button, Text } from "@mantine/core";
import { IconHome2, IconSettings } from '@tabler/icons-react';
import { Navigate, useNavigate, Outlet, useLocation  } from "react-router-dom";

<<<<<<< HEAD
// Frontend-Amir
import { MantineProvider, Container, Group, Text, Grid, createTheme, Paper, Flex, Button} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import cx from "clsx";
import dayjs from "dayjs";
import classes from "./EmployerPage.module.css";
import HeaderCard from "./../components/HeaderCard";
import ImagePaper from "./../components/ImagePaper";
import ChartPaper from "./../components/ChartPaper";
import CardScroll from "./../components/CardScroll";
import StudentCarousel from "./../components/StudentCarousel";
import Post_Job_image from "./../assets/post_job.jpg"
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
=======
import { useAuth } from "../context/AuthContext";
import { useFireStoreUser } from "../hooks/useFirestoreUser";
import { fetchJobs, assignJob, verifyJobCompletion } from "../services/jobService";

import HomeNavbar from "../components/HomeNavbar";
import JobTable from '../components/JobTable';
>>>>>>> upstream/main

const EmployerPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); //
  const { user, role, token } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      const fetchedJobs = await fetchJobs(token);
      setJobs(fetchedJobs);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error("Error loading jobs:", err);
      setJobs([]);
    }
  };
  
  useEffect(() => {
    loadJobs();
  
    if (location.state?.reload) {
      window.history.replaceState({}, document.title); // Clear state
    }
  }, [token, location.state?.reload]);
  
  
  const handleVerifyCompletion = async (jobId) => {
    try {
      await verifyJobCompletion(jobId);
      // Refresh jobs list to reflect the change
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
      alert('Job verified successfully!');
    } catch (err) {
      console.error('Failed to verify job:', err);
      alert('Failed to verify job. Please try again.');
    }
  };

  const navbarData = [
    { link: '.', label: 'Home', icon: IconHome2 },
    { link: 'add-job', label: 'Add Job', icon: IconSettings },
    { link: '', label: 'Settings', icon: IconSettings },
  ];

  // ❗ Block unauthorized access
  if (!user || role !== "employer") {
    return <Navigate to="/" />;
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <Container size="xl" maw="1400px">
        <Group align="flex-start">
          {/* left */}
          <Box>
            <HomeNavbar 
            userData={userData}
            navbarData={navbarData}/>
          </Box>
          {/* right */}
          <Box>
            {/* Only show job listings on the main employer page, not in child routes */}
            {window.location.pathname === '/employer' && (
              <div>
                <h2>Job Listings</h2>
                <p>No jobs available.</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            )}
            <Outlet />
          </Box>
        </Group>
      </Container>
    );
  }

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
<<<<<<< HEAD
    // Frontend-Amir
    <MantineProvider theme={theme}>
      <Container size="responsive" bg="var(--mantine-color-white)">
        <Grid justify="center" gutter="lg">

          {/* Xi Xi */}
          <Grid.Col>
            <div>
              <h2>Employer Dashboard</h2>
              <p>Welcome, {user?.email}</p>
              <p>Role: {role}</p>
              <button onClick={() => signOut(auth)}>Logout</button>

              <h3>Select School</h3>
              <select
                value={selectedSchool}
                onChange={(e) => fetchStudents(e.target.value)}
              >
                <option value="">-- Select a School --</option>
                {schools.map((school) => (
                  <option key={school.code || school} value={school.code || school}>
                    {school.name || school}
                  </option>
                ))}
              </select>

              {students.length > 0 && (
                <>
                  <h3>Students in: {selectedSchool}</h3>
                  <ul>
                    {students.map((student) => (
                      <li key={student.id}>
                        {student.email} ({student.customUid})
                        <button onClick={() => fetchSkills(student.id)}>View Skills</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {selectedStudent && (
                <div>
                  <h4>Skills of: {selectedStudent.email}</h4>
                  <ul>
                    {skills.map((skill) => (
                      <li key={skill.id}>
                        <strong>{skill.title}</strong> ({skill.level})<br />
                        <em>{skill.description}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Grid.Col>
          {/* Xi Xi */}
          
          {/* Heading component (Profile)*/}
          <Grid.Col span={10}>
          <HeaderCard userType="employer" userData={employerData}/>
          </Grid.Col>

          {/* Features like posting job and a dashboard of the summary of application*/}
          <Grid.Col span={10} className={classes.heading}>
            Features
          </Grid.Col>

          {/* Post a job */}
          <Grid.Col span={10}>
            <ImagePaper 
            title="Need a helping hand?"
            description="Post your job and connect with talented students eager to grow."
            buttonText="Post a Job"
            buttonLink="/post-job"
            imageUrl={Post_Job_image}
            />
          </Grid.Col>

          {/* Application Summary with Chart */}
          <Grid.Col span={10}>
            <ChartPaper data={ApplicationData} />
          </Grid.Col>

          {/* Messages List */}
          <Grid.Col span={10}>
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
          <Grid.Col span={10}>
            <Paper p="lg" radius="md" shadow="sm" withBorder>
              <Flex justify="space-between" align="center" mb="lg">
                <div className={classes.heading}>Students</div>
                <Button
                  component={Link}
                  // to be implemented later
                  to="/students"
                  mr="sm"
                  className={classes.actionButton}
                >
                  Show all
                </Button>
              </Flex>
              <StudentCarousel />
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </MantineProvider>
    // Frontend-Amir

=======
    <Container size="xl" maw="1400px" pt="md">
      <Flex align="flex-start" gap="md">
        {/* Left: Sidebar - 30% */}
        <Box style={{ width: '30%' }}>
          <HomeNavbar
            userData={userData}
            navbarData={navbarData}
          />
        </Box>

        {/* Right: Content - 70% */}
        <Box style={{ width: '70%' }}>
          {location.pathname === '/employer' ? (
            <JobTable
              title="My Job Listings"
              data={jobs}
              onVerify={handleVerifyCompletion}
              onEdit={(jobId) => navigate(`/employer/edit-job/${jobId}`)}
              onRefresh={loadJobs}
            />
          ) : (
            <Outlet />
          )}
        </Box>
      </Flex>
    </Container>
>>>>>>> upstream/main
  );
};

export default EmployerPage;