import {
  IconSchool,
  IconCertificate,
  IconBriefcase,
} from "@tabler/icons-react";
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../style/HomePage.module.css";

const HomePage = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const featuresData = [
    {
      title: t("homepage.student.title"),
      description: t("homepage.student.desc"),
      icon: IconSchool,
    },
    {
      title: t("homepage.teacher.title"),
      description: t("homepage.teacher.desc"),
      icon: IconCertificate,
    },
    {
      title: t("homepage.employer.title"),
      description: t("homepage.employer.desc"),
      icon: IconBriefcase,
    },
  ];

  const features = featuresData.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon size={50} stroke={1.5} color={theme.colors.blue[6]} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl" mt="100px">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          {t("homepage.badge")}
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        {t("homepage.title")}
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        {t("homepage.subtitle")}
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
};

export default HomePage;
