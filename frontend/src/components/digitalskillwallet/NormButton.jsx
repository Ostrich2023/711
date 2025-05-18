import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classes from "./NormButton.module.css";

export default function NormButton({ icon, label, to, style }) {
  const { t } = useTranslation();

  return (
    <Button
      component={Link}
      to={to}
      leftSection={icon}
      className={classes.actionButton}
      style={style}
    >
      {t(label)}
    </Button>
  );
}
