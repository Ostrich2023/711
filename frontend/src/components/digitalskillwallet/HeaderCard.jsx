import { Paper, Flex } from "@mantine/core";
import { UserButton } from "../employer/UserButton";
import { useTranslation } from "react-i18next";
import classes from "../../style/DigitalSkillWallet.module.css";

export default function HeaderCard({ userData, userType = "User" }) {
  const { t } = useTranslation();

  return (
    <Paper shadow="xs" radius="md" p="sm" withBorder className={classes.headerPaper}>
      <Flex justify="space-between" align="center" direction="row">
        <div>
          <h2 className={classes.headerTitle}>{t(`header.${userType.toLowerCase()}`)} {t("header.overview")}</h2>
          <p className={classes.headerSubtitle}>
            {t("header.id")}: {userData.id} | {t("header.name")}: {userData.name} | {t("header.school")}: {userData.school} | {t("header.major")}: {userData.major} | {t("header.role")}: {userData.role}
          </p>
        </div>
        <div className={classes.userButtonWrapper}>
          <UserButton
            collapsed={true}
            name={userData.name}
            role={userData.role}
            image={userData.image}
          />
        </div>
      </Flex>
    </Paper>
  );
}
