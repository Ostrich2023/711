import React from "react";
import { Container, Group, Box, Center, Loader } from "@mantine/core";
import {
  IconHome2,
  IconFileCheck,
  IconBook2,
  IconSettings,
} from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

import HomeNavbar from "../../components/HomeNavbar";

const SchoolPage = () => {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  if (!user || role !== "school") return <Navigate to="/" />;

  const navbarData = [
    { link: ".", label: "Home", icon: IconHome2 },
    { link: "verify-skill", label: "Verify Skills", icon: IconFileCheck },
    { link: "manage-courses", label: "Manage Courses", icon: IconBook2 },
    { link: "", label: "Settings", icon: IconSettings },
  ];

  return (
    <Container maw="1500px">
      <Group align="flex-start">
        {/* Left - Sidebar */}
        <Box>
          {isLoading ? (
            <Center><Loader size="sm" /></Center>
          ) : (
            <HomeNavbar userData={userData} navbarData={navbarData} />
          )}
        </Box>

        {/* Right - Routed Pages */}
        <Box style={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Group>
    </Container>
  );
};

export default SchoolPage;
