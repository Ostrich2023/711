import { MultiSelect, Card, Avatar, Text, Group, Grid, Box, Select, Progress, Button, Modal, Stack, TextInput } from '@mantine/core';
import { IconBrandHtml5, IconBrandCss3, IconBrandJavascript, IconBrandPython, IconBrandReact, IconBrandNodejs, IconBrandMessenger, IconBrandTeams } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

import StudentCard from "../../components/employer/StudentCard";
import { searchStudentsBySkills } from "../../services/employerService";
import { fetchSoftSkills  } from '../../services/jobService';


/*
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


const bgColors = ['#8ff7d2', '#add8e6', '#c2d4f2', '#9cd1f9'];



const softSkills = ['Communication', 'Problem Solving', 'Collaboration', 'Critical Thinking', 'Creativity'];
const techSkills = ['React', 'CSS', 'HTML', 'JavaScript', 'Python', 'Node.js'];
*/

const jobAds = [
  { value: "1", label: 'Frontend Developer' },
  { value: "2", label: 'Data Analyst' },
  { value: "3", label: 'Backend Developer' },
  { value: "4", label: 'UX Designer' },
  { value: "5", label: 'Project Manager' },
  { value: "6", label: 'Marketing Specialist' },
];

const EmployerStudentsList = () => {
  const [assignedJobs, setAssignedJobs] = useState({});
  const [openedModalId, setOpenedModalId] = useState(null);
  const [selectedSoftSkills, setSelectedSoftSkills] = useState([]);
  const [selectedTechSkills, setSelectedTechSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const { token } = useAuth();
  const [softSkillOptions, setSoftSkillOptions] = useState([]);
  const [jobOptionsMap, setJobOptionsMap] = useState({});
  

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load students based on selected filters
        const result = await searchStudentsBySkills(selectedTechSkills, selectedSoftSkills, token);
        console.log(result);
        setStudents(result);

        // Load soft skills for dropdown filter
        const softSkills = await fetchSoftSkills(token);
        setSoftSkillOptions(softSkills.map(s => ({ value: s.id, label: s.name })));

        
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    if (token) loadData();
  }, [selectedTechSkills, selectedSoftSkills, token]);


  const handleJobChange = (studentId, job) => {
    setAssignedJobs((prev) => ({ ...prev, [studentId]: job }));
  };
  
  const filteredStudents = students.filter((student) => {
    const allSkills = student.skills || [];

    const matchesTech = selectedTechSkills.every(skill =>
      allSkills.some(s => s.title === skill)
    );

    const matchesSoft = selectedSoftSkills.every(softId =>
      allSkills.some(s => (s.softSkills || []).includes(softId))
    );

    return matchesTech && matchesSoft;
  });

  return (
    <Box flex={1} mt="30px">
      <Grid gutter="xl">
        
        {/* Technical Skills Filter */}
        <Grid.Col span={6}>
          <TextInput
            label="Filter by Technical Skills"
            value={selectedTechSkills.join(", ")}
            onChange={(e) => {
              const input = e.currentTarget.value;
              const parsed = input
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");
              setSelectedTechSkills(parsed);
            }}
            placeholder="e.g. React, Node.js, Python"
          />
        </Grid.Col>

        {/* Soft Skills Filter */}
        <Grid.Col span={6}>
          <MultiSelect
            label="Filter by Soft Skills"
            data={softSkillOptions}
            value={selectedSoftSkills}
            onChange={setSelectedSoftSkills}
            searchable
            clearable
            placeholder="Select soft skills"
          />
        </Grid.Col>



        {students.map((student) => (
          <Grid.Col key={student.id} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <StudentCard
              {...student}
              setOpenedModalId={setOpenedModalId}
              openedModalId={openedModalId}
              jobOptions={jobAds || []}  
              assignedJobs={assignedJobs}
              handleJobChange={handleJobChange}
            />
                 
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default EmployerStudentsList;
