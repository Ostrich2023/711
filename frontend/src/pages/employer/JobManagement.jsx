import React from "react";
import { Box, Tabs } from "@mantine/core";
import JobForms from "./JobForms"; // 默认导出组件，已包含所有功能

export default function JobManagement() {
  return (
    <Box maw={800} mx="auto" mt="xl">
      <Tabs defaultValue="manage">
        <Tabs.List>
          <Tabs.Tab value="manage">Manage Jobs</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manage" pt="md">
          <JobForms />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
