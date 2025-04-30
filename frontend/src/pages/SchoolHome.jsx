import React from "react";
import { Box, SimpleGrid, Title, Text } from "@mantine/core";

import Notification from "../components/Notification"
import UserTable from "../components/UserTable";
import ActivityList from "../components/ActivityList";

export default function SchoolHome(){
  return (
    <Box flex={1}>
      <Notification />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <ActivityList />
        <UserTable />
      </SimpleGrid>
    </Box>
  );
};