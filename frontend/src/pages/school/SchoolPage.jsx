import React from "react";
import { Container, Group, Box } from "@mantine/core";
import {
  IconHome2,
  IconFileCheck,
  IconBook2,
  IconSettings,
} from "@tabler/icons-react";
import { useNavigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useFireStoreUser } from "../../hooks/useFirestoreUser";

import HomeNavbar from "../../components/HomeNavbar";

const SchoolPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);

  const navbarData = [
    { link: ".", label: "Home", icon: IconHome2 },
    { link: "verify-skill", label: "Verify Skills", icon: IconFileCheck },
    { link: "manage-courses", label: "Manage Courses", icon: IconBook2 },
    { link: "", label: "Settings", icon: IconSettings },
  ];

  // Block unauthorized access
  if (isLoading || !user) return <p>Loading user info...</p>;

  return (
    <Container size="xl" maw="1400px">
      <Group align="flex-start">
        {/* Left navbar */}
        <Box>
          <HomeNavbar userData={userData} navbarData={navbarData} />
        </Box>

        {/* Right content area */}
        <Outlet />
      </Group>
    </Container>
  );
};

export default SchoolPage;
