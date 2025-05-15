import React, { useState } from "react";
import { Tabs, Box } from "@mantine/core";
import JobForms, { MyJobs, JobDetail } from "./JobForms";

export default function JobManagement() {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <Box maw={800} mx="auto" mt="xl">
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="create">Create Job</Tabs.Tab>
                    <Tabs.Tab value="my-jobs">My Jobs</Tabs.Tab>
                    <Tabs.Tab value="job-detail">Job Detail</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="create" pt="md">
                    <JobForms />
                </Tabs.Panel>

                <Tabs.Panel value="my-jobs" pt="md">
                    <MyJobs />
                </Tabs.Panel>

                <Tabs.Panel value="job-detail" pt="md">
                    <JobDetail jobId={"some-job-id"} />
                </Tabs.Panel>
            </Tabs>
        </Box>
    );
}