import { Box, Title, Paper, Text, Group, Button, Badge, Stack } from '@mantine/core';

const courseData = [
  {
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS101',
    students: 45,
    assignments: 5,
  },
  {
    courseName: 'Software Engineering Fundamentals',
    courseCode: 'SE201',
    students: 30,
    assignments: 3,
  },
  {
    courseName: 'Data Science Basics',
    courseCode: 'DS301',
    students: 28,
    assignments: 4,
  },
  {
    courseName: 'Data Science Basics',
    courseCode: 'DS301',
    students: 28,
    assignments: 4,
  },
];

export default function ActivityList() {
  return (
    <Box w="100%" mt="25px">
      <Stack spacing="xs">
        <Group>
            <Title order={2}>My Courses</Title>
            <Button variant="light" ml="auto" mt="15px">More</Button>
        </Group>
        {courseData.map((course) => (
          <Paper key={course.courseCode} withBorder p="md" radius="md" style={{height:"99px"}}>
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
                  <Badge color="green" variant="light" radius="sm">
                    {course.assignments} Assignments
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
