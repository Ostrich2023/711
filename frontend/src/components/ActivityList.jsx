import { Box, Title, Paper, Text, Group, Button, Badge, Stack } from '@mantine/core';

export default function ActivityList(props) {
  return (
    <Box w="100%" mb="50px">
      <Stack spacing="xs">
        <Group>
            <Title order={3}>My Courses</Title>
            <Button variant="light" ml="auto" mt="15px">More</Button>
        </Group>
        {props.courseData.map((course, index) => (
            <Paper key={`${course.courseCode}-${index}`} withBorder p="md" radius="md" style={{ height: "99px" }}>
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={600}>{course.courseName}</Text>
                  <Text size="xs" c="dimmed">
                    {course.courseCode}
                  </Text>
                  <Group mt="xs">
                    <Badge color="blue" variant="light" radius="sm">
                      {course.students} Students
                    </Badge>
                  </Group>
                </div>
              </Group>
            </Paper>
          ))}
      </Stack>
    </Box>
  );
}
