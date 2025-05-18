import {
  Box,
  Card,
  Text,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function Notification({ count = 0, label = "items", messagePrefix, messageSuffix }) {
  const { t } = useTranslation();

  return (
    <Box w="100%">
      <Card shadow="xs" padding="md" radius="md" withBorder bg="blue.0" mb="md" mt="10px">
        <Group align="center">
          <ThemeIcon variant="subtle" color="blue" radius="xl" size="lg">
            <IconBell size={20} />
          </ThemeIcon>
          <Text fw="600">
            {t(messagePrefix)}{" "}
            <Text span fw={700} c="blue">
              {count} {t(label)}
            </Text>{" "}
            {t(messageSuffix)}
          </Text>
        </Group>
      </Card>
    </Box>
  );
}
