import { Card, Modal, Select, Avatar, Box, Group, Text, Button } from "@mantine/core";
import StudentDashboard from "./StudentDashboard";

function StudentCard({
  id,
  name,
  university,
  schoolName,
  image,
  major = "Not specified",
  majorName = "",
  passedCourses= [],
  softSkills = [],
  skills = [],
  setOpenedModalId = () => {},
  openedModalId,
  jobOptions = [],
  assignedJobs = {},
  handleJobChange = () => {},
  onSendJobApplication = () => {},
}) {
  const studentData = {
    id,
    name,
    university,
    schoolName,
    image,
    major,
    majorName,
    passedCourses: passedCourses || [],
    softSkills: softSkills || [],  // fallback in case undefined
    skills: skills || [],
  };

  const bgColors = ["#E3F2FD", "#FCE4EC", "#FFF3E0", "#E8F5E9"];
  const selectedJobValue = assignedJobs[id] ?? null;
  const isModalOpen = openedModalId === id;
  
  return (
    <Card shadow="sm" radius="md" h="100%" withBorder style={{ maxWidth: 400 }}>
      <div
        style={{
          backgroundColor: bgColors[id % 4],
          height: 80,
          borderRadius: "8px 8px 0 0",
        }}
      />
      <Avatar
        src={image || null}
        size={80}
        radius={80}
        mx="auto"
        mt={-40}
        style={{ border: "4px solid white" }}
      >
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </Avatar>

      <Box px="sm" mt="sm" style={{ flexGrow: 1 }}>
        <Text align="center" fw={700}>
          {name}
        </Text>
        <Box mt="sm">
          <Group>
            <Text fw={600}>University:</Text>
            <Text>{schoolName}</Text>
          </Group>
          <Group>
            <Text fw={600}>Major:</Text>
            <Text>{majorName}</Text>
          </Group>
        </Box>

        <Group mt="sm" align="start" spacing="xs" grow>

          {/*
          <Box>
            <Text mb="-sm" fw={600}>
              Soft Skills
            </Text>
            <ul style={{ paddingLeft: 16 }}>
              {softSkills.map((s, i) => (
                <li key={i}>{s.skill || s}</li>
              ))}
            </ul>
          </Box>
          */}
          <Box>
            <Text mb="-sm" fw={600}>
              Technical Skills
            </Text>
            <ul style={{ paddingLeft: 16 }}>
              {skills.map((s, i) => (
                <li key={i}>
                  <Text fw={500}>{s.title}</Text>
                  {Array.isArray(s.softSkillTitles) && s.softSkillTitles.length > 0 && (
                    <ul style={{ paddingLeft: 16 }}>
                      {s.softSkillTitles.map((ss, j) => (
                        <li key={j}>
                          <Text size="sm" c="dimmed">• {ss}</Text>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </Box>
        </Group>
      </Box>

      <Box px="sm" pb="sm">
        <Button
          fullWidth
          mt="xs"
          variant="light"
          onClick={() => setOpenedModalId(id)}
        >
          Show Dashboard
        </Button>

        
    <Group mt="sm">
      <Select
        placeholder="Assign a job"
        data={jobOptions}
        searchable
        allowDeselect
        value={assignedJobs[id] ?? null}
        onChange={(value) => handleJobChange(id, value)}
        nothingFoundMessage="Nothing found..."
        w="100%"
        mt="sm"
      />
    </Group>

    <Button
      mt="sm"
      fullWidth
      style={{
        backgroundColor: assignedJobs[id] ? '#228be6' : '#ccc',
        color: "white",
        cursor: assignedJobs[id] ? 'pointer' : 'not-allowed',
      }}
      disabled={!assignedJobs[id]}
      onClick={() => {
        const selectedJob = jobOptions.find(
          (job) => job.value === assignedJobs[id]
        );

        if (selectedJob) {
          alert(`Job "${selectedJob.label}" application sent to ${name}`);
        }
      }}
    >
      Send Job Application
    </Button>


      </Box>
      
      {/* Modal with StudentDashboard */}
      <Modal
        opened={isModalOpen}
        onClose={() => setOpenedModalId(null)}
        size="lg"
        centered
        scrollArea="inside"
      >
        <StudentDashboard student={studentData} />
      </Modal>

    </Card>
  );
}

export default StudentCard;
