import { Title, Box, SimpleGrid, Card, Text, Button, Group } from "@mantine/core";

export default function PendingActions() {
  const actions = [
    {
      title: 'Skill Approval Requests',
      description: 'You currently have 5 skill requests pending verify.',
      actionText: 'Verify Skills',
      actionLink: '/teacher/verify-skills', // 以后加路由跳转
    },
    {
      title: 'Certificate Publishing',
      description: 'You currently have 2 certificates ready for publishing.',
      actionText: 'Publish Certificates',
      actionLink: '/teacher/issue_certificates', // 以后加路由跳转
    },
  ];

  return (
    <Box w="100%">
      <Group justify="space-between" align="center" mb="md">
        <Title order={2} mt="38px">Pending Actions</Title>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {actions.map((item, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={600}>{item.title}</Text>
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              {item.description}
            </Text>
            <Button fullWidth variant="light" radius="md">
              {item.actionText}
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
