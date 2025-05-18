import { useState } from 'react';
import {
  Group, Drawer, Avatar, Text, UnstyledButton, useMantineTheme
} from '@mantine/core';
import { IconBaselineDensityMedium } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import classes from '../style/HomeNavbar.module.css';
import ActionButton from './common/ActionButton';

export default function HomeNavbar({ userData, navbarData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useMantineTheme();

  // 当前嵌套路由前缀（如 "student" / "school"）
  const basePath = location.pathname.split("/")[1] || "";

  const [active, setActive] = useState(navbarData[0]?.labelKey);
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const handleActionButton = () => setOpened(true);

  const links = navbarData.map((item) => {
    const resolvedPath = `/${basePath}/${item.link}`.replace(/\/+$/, "");

    return (
      <a
        className={classes.link}
        data-active={active === item.labelKey || undefined}
        href={resolvedPath}
        key={item.labelKey}
        onClick={(event) => {
          event.preventDefault();
          navigate(resolvedPath);
          setActive(item.labelKey);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{t(item.labelKey)}</span>
      </a>
    );
  });

  const userSection = (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar name={userData?.name} color="indigo" radius="xl">
          {userData?.name?.slice(0, 2).toUpperCase()}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="18px" fw={500}>
            {userData?.name}
          </Text>
          <Text c="dimmed" size="14px">
            {userData?.email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );

  return (
    <>
      {isMobile ? (
        <>
          <div className={classes.actionNavbar}>
            <ActionButton
              icon={<IconBaselineDensityMedium size={20} stroke={1.5} />}
              onActionButton={handleActionButton}
            />
          </div>

          <Drawer
            withOverlay
            position="left"
            opened={opened}
            size="300px"
            onClose={() => setOpened(false)}
            withCloseButton={false}
          >
            <nav className={classes.navbar}>
              {userSection}
              <div className={classes.navbarMain}>{links}</div>
            </nav>
          </Drawer>
        </>
      ) : (
        <nav className={classes.navbar}>
          {userSection}
          <div className={classes.navbarMain}>{links}</div>
        </nav>
      )}
    </>
  );
}
