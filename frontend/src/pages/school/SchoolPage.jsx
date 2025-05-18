import React from "react";
import { Container, Group, Box, Center, Loader } from "@mantine/core";
import {
  IconHome2,
  IconFileCheck,
  IconBook2,
  IconSettings
} from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

import HomeNavbar from "../../components/HomeNavbar";

const SchoolPage = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  if (!user || role !== "school") return <Navigate to="/" />;

const navbarData = [
  { link: "", labelKey: "navbar.home", icon: IconHome2 },
  { link: "verify-skill", labelKey: "school.verifySkills", icon: IconFileCheck },
  { link: "manage-courses", labelKey: "school.manageCourses", icon: IconBook2 },
  { link: "settings", labelKey: "navbar.settings", icon: IconSettings }
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
