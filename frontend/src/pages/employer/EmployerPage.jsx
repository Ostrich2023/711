import React, { useEffect, useState } from "react";
import { Container, Group, Box, Center, Loader } from "@mantine/core";
import { 
  IconHome2,
  IconCertificate,
  IconClipboardList,
  IconSettings,
} from '@tabler/icons-react';
import { Navigate, Outlet } from "react-router-dom";  

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

import HomeNavbar from "../../components/HomeNavbar";

const EmployerPage = () => {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  if (!user || role !== "employer") return <Navigate to="/" />;

const navbarData = [
  { link: '', labelKey: 'navbar.home', icon: IconHome2 },
  { link: 'jobs', labelKey: 'navbar.postJobs', icon: IconClipboardList },
  { link: 'applications', labelKey: 'navbar.applications', icon: IconCertificate },
  { link: 'settings', labelKey: 'navbar.settings', icon: IconSettings },
];

  return (
    <Container size="xl" maw="1400px">
      <Group align="flex-start">
        {/* 左侧导航栏 */}
        <Box>
          {isLoading ? (
            <Center><Loader size="sm" /></Center>
          ) : (
            <HomeNavbar userData={userData} navbarData={navbarData} />
          )}
        </Box>

        {/* 右侧内容区 */}
        <Box style={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Group>
    </Container>
  );
};

export default EmployerPage;
