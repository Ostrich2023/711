import React from 'react';
import {
  Table,
  Avatar,
  Text,
  Group,
  Box,
  Title,
  SimpleGrid,
} from '@mantine/core';

const data = [
  {
    id: '1',
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    skillTitle: 'React',
    skillDesc: 'React Basics and component structure',
    extraInfo: 'Completed 3 React projects, submitted GitHub link and screenshot.',
    image: '/attachments/react-project.png',
    file: '/attachments/react-project-summary.pdf',
  },
  {
    id: '2',
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    name: 'Bob Smith',
    email: 'bobsmith@student.edu',
    skillTitle: 'UI Design',
    skillDesc: 'Designed Figma-based UI layouts',
    extraInfo: 'Created interactive Figma prototype and exported assets.',
    image: '/attachments/ui-design.png',
    file: '/attachments/ui-design-doc.pdf',
  },
  {
    id: '3',
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    name: 'Catherine Green',
    email: 'catherine@student.edu',
    skillTitle: 'Git & GitHub',
    skillDesc: 'Collaborative version control project',
    extraInfo: 'Led a team repo with proper branching and pull requests.',
    image: '/attachments/git-workflow.png',
    file: '/attachments/git-summary.pdf',
  },
];

export default function SkillVerifyList(props) {

  const rows = data.map((item) => (
    <Table.Tr
      key={item.name}
      onClick={() => props.onRowClick(item.id)}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td>
        <Group>
          <Avatar src={item.avatar} radius="xl" size="md" />
          <Box>
            <Text fw={500}>{item.name}</Text>
            <Text c="dimmed" fz="xs">{item.email}</Text>
          </Box>
        </Group>
      </Table.Td>

      <Table.Td>
        <Box>
          <Text fw={600}>{item.skillTitle}</Text>
          <Text c="dimmed" fz="xs">{item.skillDesc}</Text>
        </Box>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box w="100%">
      <Group>
        <Title order={2} mt="38px">Verify Skill Submissions</Title>
      </Group>
      <SimpleGrid>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Student</Table.Th>
              <Table.Th>Skill</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </SimpleGrid>
    </Box>
  );
}
