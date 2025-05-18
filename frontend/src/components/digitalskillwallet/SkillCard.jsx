import { Box, Card, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../../style/DigitalSkillWallet.module.css";

const SkillCard = ({ title, children }) => {
  const { t } = useTranslation();

  return (
    <Card shadow="sm" radius="md" withBorder bg="var(--mantine-color-white)">
      <Group className={classes.heading} align="center">
        <Text size="md" fw={700}>
          {t(title)}
        </Text>
      </Group>
      <Box>{children}</Box>
    </Card>
  );
};

export default SkillCard;
