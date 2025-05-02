import {
  Box,
  Card,
  Text,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

export default function Notification(props) {
  return (
    <Box w="100%">

      {/* 顶部提醒栏 */}
      <Card shadow="xs" padding="md" radius="md" withBorder bg="blue.0" mb="md" mt="10px">
        <Group align="center">
          <ThemeIcon variant="subtle" color="blue" radius="xl" size="lg">
            <IconBell size={20} />
          </ThemeIcon>
          <Text fw="600px">
            {props.messagePrefix}
            <Text span fw={700} c="blue">
            &nbsp;{props.count}&nbsp;{props.label}&nbsp;
            </Text>
            {props.messageSuffix}
          </Text>
        </Group>
      </Card>

    </Box>
  );
}