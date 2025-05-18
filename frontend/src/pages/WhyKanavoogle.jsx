import { Container, Divider, List, Space, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconBook,
  IconBuildingBank,
  IconCertificate,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from "react-i18next";

export default function WhyKanavoogle() {
  const { t } = useTranslation();

  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center">
        {t("why.titlePrefix")} <span style={{ color: 'var(--mantine-color-blue-6)' }}>Kanavoogle</span>?
      </Title>
      <Text ta="center" c="dimmed" mt="sm">
        {t("why.subtitle")}
      </Text>

      <Space h="xl" />
      <Divider label={t("why.problemTitle")} labelPosition="center" />
      <Space h="md" />

      <Text>{t("why.problemText")}</Text>

      <Space h="xl" />
      <Divider label={t("why.solutionTitle")} labelPosition="center" />
      <Space h="md" />

      <List spacing="lg" size="md">
        <List.Item icon={<ThemeIcon radius="xl" size={28} color="blue"><IconCertificate size={16} /></ThemeIcon>}>
          <Text fw={600}>{t("why.immutable.title")}</Text>
          <Text c="dimmed" fz="sm">{t("why.immutable.desc")}</Text>
        </List.Item>

        <List.Item icon={<ThemeIcon radius="xl" size={28} color="blue"><IconBook size={16} /></ThemeIcon>}>
          <Text fw={600}>{t("why.wallet.title")}</Text>
          <Text c="dimmed" fz="sm">{t("why.wallet.desc")}</Text>
        </List.Item>

        <List.Item icon={<ThemeIcon radius="xl" size={28} color="blue"><IconUsers size={16} /></ThemeIcon>}>
          <Text fw={600}>{t("why.workflow.title")}</Text>
          <Text c="dimmed" fz="sm">{t("why.workflow.desc")}</Text>
        </List.Item>

        <List.Item icon={<ThemeIcon radius="xl" size={28} color="blue"><IconBuildingBank size={16} /></ThemeIcon>}>
          <Text fw={600}>{t("why.integration.title")}</Text>
          <Text c="dimmed" fz="sm">{t("why.integration.desc")}</Text>
        </List.Item>
      </List>

      <Space h="xl" />
      <Divider label={t("why.benefitTitle")} labelPosition="center" />
      <Space h="md" />

      <List spacing="lg" size="md" icon={null}>
        <List.Item>{t("why.benefits.student")}</List.Item>
        <List.Item>{t("why.benefits.teacher")}</List.Item>
        <List.Item>{t("why.benefits.employer")}</List.Item>
      </List>
    </Container>
  );
}
