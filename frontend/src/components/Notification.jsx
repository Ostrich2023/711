import { Title, Box, Group, Stack, Text, Paper, Divider } from "@mantine/core";
export default function Notification(){
  
  const notifications = [
    {
      title: 'Week 9: Ass2 Industry Forum Friday Wk9, 2 May, 11am - 12pm on Zoom',
      content: 'Dear Students, Please place the details of the event below in...',
      date: '25 Apr 2025, 12:36',
      unread: true,
    },
    {
      title: 'Week 7 Update (Ass1 survey, Ass2 brief, Guest lecture and more)',
      content: 'Dear Students, I hope that your projects are progressing well...',
      date: '10 Apr 2025, 11:25',
      unread: false,
    },
    {
      title: 'Week 7 Update (Ass1 survey, Ass2 brief, Guest lecture and more)',
      content: 'Dear Students, I hope that your projects are progressing well...',
      date: '10 Apr 2025, 11:25',
      unread: false,
    },
  ];
  
  return(
    <Box style={{ maxWidth: 1000, flex: 1 }} >
      <Stack spacing="xs">
        <Title mt="38px" order={2}>Notification</Title> 
        {notifications.map((item, index) => (
          <Paper key={index} withBorder p="md" radius="md">
            <Group align="flex-start" spacing="md">
              {/* 左边小圆点 */}
              <Box
                w={8}
                h={8}
                mt={16}
                bg={item.unread ? 'blue.7' : 'gray.3'}
                style={{ borderRadius: '50%' }}
              />


              {/* 正文内容 */}
              <Box style={{ flex: 1 }}>
                <Text fw={500} size="sm">
                  {item.title}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {item.content}
                </Text>
              </Box>

              {/* 时间 */}
              <Box>
                <Text size="xs" c="dimmed">
                  Posted on:
                </Text>
                <Text size="xs">{item.date}</Text>
              </Box>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}