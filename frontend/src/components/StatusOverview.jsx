import { useState } from "react";
import {
  Box,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  Select,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconClock,
  IconBrandPython,
  IconBrandJavascript,
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandReact,
  IconBrandNodejs,
} from "@tabler/icons-react";

const allSkills = [
  { name: "HTML", course: "Rapid Web Development", status: "Verified", icon: <IconBrandHtml5 size={22} />, iconColor: "red" },
  { name: "CSS", course: "Rapid Web Development", status: "Verified", icon: <IconBrandCss3 size={22} />, iconColor: "blue" },
  { name: "JavaScript", course: "Rapid Web Development", status: "In Progress", icon: <IconBrandJavascript size={22} />, iconColor: "blue" },
  { name: "Python", course: "Rapid Web Development", status: "Verified", icon: <IconBrandPython size={22} />, iconColor: "green" },
  { name: "React", course: "Frontend Frameworks", status: "Rejected", icon: <IconBrandReact size={22} />, iconColor: "cyan" },
  { name: "Node.js", course: "Backend Development", status: "In Progress", icon: <IconBrandNodejs size={22} />, iconColor: "teal" },
];

function getStatus(status) {
  switch (status) {
    case "Verified":
      return (
        <Group gap={4}>
          <IconCheck size={14} color="green" />
          <Text size="xs" c="green" fw={500}>Verified</Text>
        </Group>
      );
    case "In Progress":
      return (
        <Group gap={4}>
          <IconClock size={14} />
          <Text size="xs" c="gray" fw={500}>In Progress</Text>
        </Group>
      );
    case "Rejected":
      return (
        <Group gap={4}>
          <IconX size={14} color="red" />
          <Text size="xs" c="red" fw={500}>Rejected</Text>
        </Group>
      );
    default:
      return null;
  }
}

export default function StatusOverview() {
  const [filter, setFilter] = useState("All");

  const filteredSkills =
    filter === "All" ? allSkills : allSkills.filter((s) => s.status === filter);

  return (
    <Box my="xl">
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Skill Overview</Title>
        <Select
          data={["All", "Verified", "In Progress", "Rejected"]}
          value={filter}
          onChange={setFilter}
          size="xs"
          w={180}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="md">
        {filteredSkills.map((skill, index) => (
          <Card
            key={index}
            padding="xs"
            radius="md"
            withBorder
            style={{ backgroundColor: "#f9fafb", minHeight: 100 }}
          >
            <Stack spacing={4}>
              <Group gap={6}>
                <ThemeIcon variant="subtle" color={skill.iconColor} size="sm" radius="xl">
                  {skill.icon}
                </ThemeIcon>
                <Text fw={600} size="sm">{skill.name}</Text>
              </Group>

              <Text size="xs" c="dimmed">{skill.course}</Text>

              {getStatus(skill.status)}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
