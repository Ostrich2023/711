import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Container,
  Flex,
  Grid,
  Box,
  MantineProvider,
  createTheme,
  Rating,
  Text,
} from "@mantine/core";

import {
  IconActivity,
  IconClipboardList,
  IconFilePlus,
} from "@tabler/icons-react";

import cx from "clsx";
import AlertBox from "../../components/digitalskillwallet/AlertBox";
import BarChart from "../../components/digitalskillwallet/BarChart";
import HeaderCard from "../../components/digitalskillwallet/HeaderCard";
import PieChart from "../../components/digitalskillwallet/PieChart";
import SkillCard from "../../components/digitalskillwallet/SkillCard";
import NormButton from "../../components/digitalskillwallet/NormButton";
import classes from "./DigitalSkillWallet.module.css";

const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [classes.responsiveContainer]: size === "responsive" }),
      }),
    }),
  },
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DigitalSkillWallet = () => {
  const { user, role } = useAuth();
  const [email, setEmail] = useState("");
  const [customUid, setCustomUid] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [currentSchool, setCurrentSchool] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [newSchool, setNewSchool] = useState("");
  const [updating, setUpdating] = useState(false);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [showAlert, setShowAlert] = useState(true);

  if (!user || role !== "student") return <Navigate to="/" />;

  useEffect(() => {
    loadProfile();
    loadSchoolOptions();
    fetchVerifiedSkills();
    fetchCoursePerformance();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/student/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setEmail(data.email);
      setCustomUid(data.customUid || "");
      setWalletAddress(data.walletAddress || "");
      setCurrentSchool(data.schoolId || "");
      setNewSchool(data.schoolId || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const loadSchoolOptions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/employer/schools`);
      setSchoolList(res.data);
    } catch (error) {
      console.error("Failed to load school list:", error);
    }
  };

  const updateSchool = async () => {
    if (!newSchool) return alert("Please select a school.");
    if (newSchool === currentSchool) return alert("School unchanged.");

    setUpdating(true);
    try {
      const token = await user.getIdToken();
      await axios.put(
        `${BASE_URL}/student/update-school`,
        { schoolId: newSchool },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("School updated successfully.");
      setCurrentSchool(newSchool);
    } catch (error) {
      alert("Failed to update school.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const fetchVerifiedSkills = async () => {
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${BASE_URL}/skill/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verified = res.data.filter(skill => skill.verified === "approved");
      setVerifiedSkills(verified);
    } catch (error) {
      console.error("Failed to load verified skills:", error);
    }
  };

  const fetchCoursePerformance = async () => {
    try {
      const token = await user.getIdToken();

      const [skillsRes, avgRes] = await Promise.all([
        axios.get(`${BASE_URL}/skill/list`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/student/course-avg-scores`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const skills = skillsRes.data.filter(s => s.verified === "approved");
      const avgMap = {};
      avgRes.data.forEach(item => {
        avgMap[item.courseTitle] = parseFloat(item.avgScore);
      });

      const combined = skills.map(skill => ({
        courseTitle: skill.courseTitle,
        courseCode: skill.courseCode,
        score: skill.score,
        avgScore: avgMap[skill.courseTitle] || 0,
        level: skill.level || "N/A"
      }));

      setCourseStats(combined);
    } catch (error) {
      console.error("Failed to fetch course performance:", error);
    }
  };

  const studentData = {
    id: user?.email || "SW123456",
    name: user?.username || "John Doe",
    company: "ABC University",
    role: role,
    image:
      user?.ImageUrl ||
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  };

  return (
    <MantineProvider theme={theme}>
      <Box flex={1} mt="30px">
        <Grid justify="center" gutter="xs">
          <Grid.Col span={10}>
            <HeaderCard userType="student" userData={studentData} />
          </Grid.Col>

          <Grid.Col span={10}>
            <SkillCard title="My Skill Overview">
              <Flex wrap="wrap" gap="md" justify="center">
                {courseStats.map((skill, index) => (
                  <PieChart
                    key={index}
                    skill={{
                      title: skill.courseTitle,
                      score: skill.score,
                      courseCode: skill.courseCode,
                      level: skill.level,
                      color: "#4dabf7"
                    }}
                  />
                ))}
              </Flex>
            </SkillCard>
          </Grid.Col>

          <Grid.Col span={10}>
            <SkillCard title="My Score vs Course Average">
              <BarChart data={courseStats} />
            </SkillCard>
          </Grid.Col>

          <Grid.Col span={10}>
            {showAlert && (
              <AlertBox
                onClose={() => setShowAlert(false)}
                title="Graduation Reminder"
              >
                After graduation, your school email will be deactivated. Please use your
                personal email to log in!
              </AlertBox>
            )}
          </Grid.Col>
        </Grid>
      </Box>
    </MantineProvider>
  );
};

export default DigitalSkillWallet;
