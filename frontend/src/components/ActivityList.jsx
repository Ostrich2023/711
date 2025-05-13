import { Box, Title, Paper, Text, Group, Button, Badge, Stack } from '@mantine/core';

export default function ActivityList(props) {
  return (
  <Box w="100%" mb="50px" px="sm">
    <Stack spacing="xs">
      <Group justify="space-between" align="flex-end">
        <Title order={3}>My Courses</Title>
        <Button variant="light" size="xs">More</Button>
      </Group>

      {props.courseList.map((course) => (
        <Paper
          key={course.id}
          withBorder
          p="md"
          radius="md"
          style={{ width: "100%" }}
        >
          <Group justify="space-between" align="center">
            <div>
              <Text fw={600}>{course.title}</Text>
              <Text size="xs" c="dimmed">{course.code}</Text>
              <Group mt="xs">
                <Badge color="blue" variant="light" radius="sm">
                  {course.studentCount} Students
                </Badge>
                {course.skillTemplate.hardSkills?.map((skill, index)=>(
                  <Badge key={index} color="green" variant="light" radius="sm">
                    {skill}
                  </Badge>
                ))}
              </Group>
            </div>
          </Group>
        </Paper>
      ))}
    </Stack>
  </Box>
  );
}
