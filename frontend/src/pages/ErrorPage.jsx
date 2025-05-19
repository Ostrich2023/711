import { useNavigate } from "react-router-dom";
import { Button, Container, Image, SimpleGrid, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import image from "../assets/notFound.png";
import classes from "../style/NotFound.module.css";

export default function Error() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>{t("error.title")}</Title>
          <Text c="dimmed" size="lg">
            {t("error.description")}
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            onClick={() => navigate("/")}
          >
            {t("error.backHome")}
          </Button>
        </div>
        <Image src={image} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}
