import { Avatar, Group, Box, Title, Button, Flex, Text, Stack, Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function UserTable({ title, data = [], onClickMore }) {
  const { t } = useTranslation();

  return (
    <Box w="100%" mb="50px">
      <Stack spacing="xs">
        <Group>
          <Title order={3}>{t(title)}</Title>
          {onClickMore && (
            <Button variant="light" ml="auto" mt="15px" onClick={onClickMore}>
              {t("global.more")}
            </Button>
          )}
        </Group>

        {data.map((item, index) => (
          <Paper
            key={`${item.email || item.name}-${index}`}
            withBorder
            p="sm"
            radius="md"
          >
            <Flex
              justify="space-between"
              align="center"
              direction={{ base: "column", sm: "row" }}
              gap="sm"
            >
              <Group gap="sm">
                <Avatar size={50} src={item.avatar} />
                <div>
                  <Text fw={600} size="sm">{item.name}</Text>
                  <Text size="xs" c="dimmed">{item.email}</Text>
                </div>
              </Group>
              <Flex gap="sm" align="center" wrap="wrap">
                <Text size="sm" fw={500}>{item.course}</Text>
                <Text size="xs" c="dimmed">
                  {t("user.lastActive")}: {item.lastActive}
                </Text>
              </Flex>
            </Flex>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
