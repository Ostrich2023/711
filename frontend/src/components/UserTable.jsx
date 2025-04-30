import { Avatar, Group, Box, Title, Button, Flex, Text, Stack, Paper } from '@mantine/core';

const data = [
  {
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    course: 'Computer Science',
    lastActive: '2 days ago',
  },
  {
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    name: 'Bob Smith',
    email: 'bobsmith@student.edu',
    course: 'Software Engineering',
    lastActive: '10 days ago',
  },
  {
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Catherine Green',
    email: 'catherine@student.edu',
    course: 'Data Science',
    lastActive: 'Today',
  },
  {
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'David Brown',
    email: 'david@student.edu',
    course: 'Information Technology',
    lastActive: '5 days ago',
  },
  {
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Emma White',
    email: 'emmawhite@student.edu',
    course: 'Cybersecurity',
    lastActive: '20 days ago',
  },
];

export default function UserTable() {
  return (
    <Box w="100%" mt="25px">
      <Stack spacing="xs">
        <Group>
          <Title order={2}>My Student</Title>
          <Button variant="light" ml="auto" mt="15px">More</Button>
        </Group>
        {data.map((item) => (
        <Paper withBorder p="sm" radius="md">
          <Flex justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }} gap="sm">
            <Group gap="sm">
              <Avatar size={50} src={item.avatar} />
              <div>
                <Text fw={600} size="sm">{item.name}</Text>
                <Text size="xs" c="dimmed">{item.email}</Text>
              </div>
            </Group>

            <Flex gap="sm" align="center" wrap="wrap">
              <Text size="sm" fw={500}>{item.course}</Text>
              <Text size="xs" c="dimmed">Last Active: {item.lastActive}</Text>
            </Flex>
          </Flex>
        </Paper>
        ))}
      </Stack>
    </Box>
  );
}
