import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import classes from "../../style/DigitalSkillWallet.module.css";

function AlertBox({ onClose, title, children }) {
  const { t } = useTranslation();

  return (
    <div className={classes.alert}>
      <Alert
        withCloseButton
        onClose={onClose}
        closeButtonLabel={t("global.dismiss")}
        classNames={{
          root: classes.alert_root,
          title: classes.alert_title,
          message: classes.alert_message,
          closeButton: classes.alert_closeButton,
        }}
        variant="filled"
        icon={<IconInfoCircle color="var(--mantine-color-white)" />}
        title={t(title)}
      >
        {children}
      </Alert>
    </div>
  );
}

export default AlertBox;
