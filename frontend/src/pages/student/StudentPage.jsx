import React from "react";
import { Container, Group, Box, Loader, Center } from "@mantine/core";
import {
  IconHome2,
  IconClipboardList,
  IconSettings,
} from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

import HomeNavbar from "../../components/HomeNavbar";

const StudentPage = () => {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  if (!user || role !== "student") return <Navigate to="/" />;

  const navbarData = [
    { link: ".", label: "Home", icon: IconHome2 },
    { link: "request-skill", label: "Request Skill", icon: IconClipboardList },
    { link: "settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <Container size="xl" maw="1400px" mt="md">
      <Group align="flex-start" spacing="xl" noWrap>
        {/* Left - Sidebar */}
        <Box style={{ width: 240 }}>
          {isLoading ? (
            <Center><Loader size="sm" /></Center>
          ) : (
            <HomeNavbar userData={userData} navbarData={navbarData} />
          )}
        </Box>

        {/* Right - Routed Pages */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Group>
    </Container>
  );
};

export default StudentPage;