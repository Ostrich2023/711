import { Avatar, Group, Box, Title, Button, Flex, Text, Stack, Paper } from '@mantine/core';

export default function UserTable(props) {
  return (
    <Box w="100%" mb="50px">
      <Stack spacing="xs">
        <Group>
          <Title order={3}>{props.title}</Title>
          <Button variant="light" ml="auto" mt="15px">More</Button>
        </Group>
        {props.data.map((item, index) => (
            <Paper key={`${item.email || item.name}-${index}`} withBorder p="sm" radius="md">
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
