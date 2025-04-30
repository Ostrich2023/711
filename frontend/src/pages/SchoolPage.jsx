import React from "react";
import { Container, Group, Box} from "@mantine/core";
import { 
  IconUser,
  IconFileCheck,
  IconHome2,
  IconFileCertificate, 
  IconCalendarEvent,  
  IconSettings,
  } from '@tabler/icons-react';
import { Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useFireStoreUser } from "../hooks/useFirestoreUser";

import HomeNavbar from "../components/HomeNavbar";

const SchoolPage = () => {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);
  
  const navbarData = [
    { link: '.', label: 'Home', icon: IconHome2 },
    { link: 'verify-skill', label: 'Verify Skills', icon: IconFileCheck },
    { link: 'publish-certification', label: 'Pulish Certificates', icon: IconFileCertificate },
    { link: 'students', label: 'Students', icon: IconUser },
    { link: 'courses', label: 'Courses', icon: IconCalendarEvent },
    { link: '', label: 'Settings', icon: IconSettings },
];

  //  Block unauthorized access
  if( isLoading || !user) return <p>Loading user info...</p>;
  if (role !== "school") return <Navigate to="/" />;

  return (
    <Container Container size="xl" maw="1400px">
      <Group align="flex-start">
        {/* left */}
        <Box>
          <HomeNavbar 
          userData={userData}
          navbarData={navbarData}/>
        </Box>
        {/* right */}
        <Outlet />

      </Group>
    </Container>
  );
};

export default SchoolPage;