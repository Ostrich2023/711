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
  Badge,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

function getSkillStatus(status) {
  if(status == "approved"){
    return(
      <Badge
        color="green"
        variant="filled"
        radius="xl"
        size="sm"
        style={{ fontWeight: 600 }}
      >
        APPROVED
      </Badge>
    )
  }
  else if(status == "in progress"){
    return(
      <Badge
        color="gray"
        variant="filled"
        radius="xl"
        size="sm"
        style={{ fontWeight: 600 }}
      >
        IN PROGRESS
      </Badge>
    )
  }else if(status == "reject"){
      return(
        <Badge
          color="red"
          variant="filled"
          radius="xl"
          size="sm"
          style={{ fontWeight: 600 }}
        >
          REJECTED
        </Badge>
      )  
  }
}

export default function StatusOverview(props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");

  const filteredSkills =
    filter === "All" ? props.skills : props.skills.filter((s) => s.verified === filter);

  return (
    <Box my="xl">
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>{t("home.skillOverview")}</Title>
        <Select
          data={[
            { value: "All", label: "All" },
            { value: "approved", label: "Approved" },
            { value: "in progress", label: "In Progress" },
            { value: "reject", label: "Rejected" },
          ]}
          value={filter}
          onChange={setFilter}
          size="xs"
          w={160}
        />
      </Group>

      {filteredSkills.length===0? <><Text>{t("noSkillsYet")}</Text></>:(
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {filteredSkills.map((skill, index) => (
          <Card
            key={index}
            padding="16px"
            radius="md"
            withBorder
            style={{ backgroundColor: "#f9fafb", minHeight: 80 }}
          >
            <Stack spacing={4}>
              <Text fw={600} size="16px">{skill.title}</Text>
              <Text size="13px" c="dimmed">{skill.courseTitle} · {skill.level}</Text>
              {getSkillStatus(skill.verified)}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>        
      )}

    </Box>
  );
}
