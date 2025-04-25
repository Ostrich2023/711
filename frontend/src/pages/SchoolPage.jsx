import React from "react";
import { Container, Group } from "@mantine/core";
import { 
  IconUser,
  IconFileCheck,
  IconBell,
  IconFileCertificate, 
  IconCalendarEvent,  
  IconSettings,
  } from '@tabler/icons-react';
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useFireStoreUser } from "../hooks/useFirestoreUser";

import HomeNavbar from "../components/layout/HomeNavbar";
import Notification from "../components/Notification"

const SchoolPage = () => {
  const { user, role } = useAuth();
  const { userData, isLoading } = useFireStoreUser(user);
  
  const navbarData = [
    { link: '', label: 'Home', icon: IconUser },
    { link: '', label: 'Verify Skills', icon: IconFileCheck },
    { link: '', label: 'Issue Certificates', icon: IconFileCertificate },
    { link: '', label: 'Courses', icon: IconCalendarEvent },
    { link: '', label: 'Settings', icon: IconSettings },
];

  //  Block unauthorized access
  if( isLoading || !user) return <p>Loading user info...</p>;
  if (role !== "school") return <Navigate to="/" />;

  return (
    <Container size="1600px">
      <Group align="flex-start">
        <HomeNavbar 
        userData={userData}
        navbarData={navbarData}/>
        <Notification />
      </Group>
    </Container>
  );
};

export default SchoolPage;