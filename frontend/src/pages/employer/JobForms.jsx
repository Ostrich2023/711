import React, { useState, useEffect } from "react";
import {
    Box, TextInput, Textarea, NumberInput, Button,
    MultiSelect, Notification, Table, Group, Loader, Modal, Text
} from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 创建岗位
export default function JobCreateForm() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: "", description: "", price: 0, location: "", skills: [], positions: 1,
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const skillOptions = [
        { label: "Web Design", value: "web-design" },
        { label: "JavaScript", value: "javascript" },
        { label: "Communication", value: "communication" },
    ];

    const handleSubmit = async () => {
        if (!user?.uid) {
            setErrorMsg("User not authenticated.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/job/create`, { ...form, uid: user.uid });
            setSuccessMsg("Job posted successfully!");
            setForm({ title: "", description: "", price: 0, location: "", skills: [], positions: 1 });
        } catch (err) {
            setErrorMsg(err.response?.data || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maw={600} mx="auto">
            <h2>Create a Job</h2>
            <TextInput label="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required mt="md" />
            <NumberInput label="Price" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required mt="md" />
            <TextInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required mt="md" />
            <MultiSelect label="Required Skills" data={skillOptions} value={form.skills} onChange={(value) => setForm({ ...form, skills: value })} searchable mt="md" />
            <NumberInput label="Number of Positions" value={form.positions} onChange={(value) => setForm({ ...form, positions: value })} required mt="md" />
            <Button onClick={handleSubmit} mt="xl" fullWidth loading={loading} disabled={!user?.uid}>Post Job</Button>
            {successMsg && <Notification color="green" mt="md">{successMsg}</Notification>}
            {errorMsg && <Notification color="red" mt="md">{errorMsg}</Notification>}
        </Box>
    );
}

// 编辑岗位
export function EditJobForm({ job, onUpdate, onClose }) {
    const [form, setForm] = useState(job);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/job/update/${job.id}`, { ...form, uid: job.employerId });
            onUpdate();
            onClose();
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <TextInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} mt="md" />
            <NumberInput label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} mt="md" />
            <TextInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} mt="md" />
            <NumberInput label="Number of Positions" value={form.positions || 1} onChange={(v) => setForm({ ...form, positions: v })} mt="md" />
            <Button onClick={handleUpdate} loading={loading} mt="md">Update</Button>
        </Box>
    );
}

// get列表/删除确认
export function MyJobs({ setTab }) {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [editJob, setEditJob] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/job/list`, {
                params: { uid: user.uid },
            });
            setJobs(res.data);
        } catch (err) {
            setErrorMsg("Failed to load jobs.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/job/delete/${id}`, {
                params: { uid: user.uid },
            });
            setJobs((prev) => prev.filter((j) => j.id !== id));
            setSuccessMsg("Job deleted.");
        } catch (err) {
            setErrorMsg("Failed to delete job.");
        }
    };

    useEffect(() => {
        if (user?.uid) fetchJobs();
    }, [user]);

    return (
        <Box>
            <Text fw={700} size="xl" mb="md">My Jobs</Text>
            {successMsg && <Notification color="green" mt="sm">{successMsg}</Notification>}
            {errorMsg && <Notification color="red" mt="sm">{errorMsg}</Notification>}

            <Table highlightOnHover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Positions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td>{job.title}</td>
                            <td>{job.status}</td>
                            <td>{job.positions || 1}</td>
                            <td>
                                <Group spacing="xs">
                                    <Button size="xs" onClick={() => setEditJob(job)}>Edit</Button>
                                    <Button
                                        size="xs"
                                        color="red"
                                        onClick={() =>
                                            window.confirm("Are you sure you want to delete this job?") &&
                                            handleDelete(job.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal opened={!!editJob} onClose={() => setEditJob(null)} title="Edit Job">
                {editJob && (
                    <EditJobForm
                        job={editJob}
                        onUpdate={fetchJobs}
                        onClose={() => setEditJob(null)}
                    />
                )}
            </Modal>
        </Box>
    );
}

// 查看岗位详情
export function JobDetail({ jobId }) {
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!jobId || !user?.uid) return;
        axios.get(`${BASE_URL}/job/${jobId}`, { params: { uid: user.uid } })
            .then(res => setJob(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [jobId, user]);

    if (loading) return <Loader mt="md" />;
    if (!job) return <Text color="dimmed">Job not found or unauthorized.</Text>;

    return (
        <Box mt="md">
            <Text size="lg" fw={700}>{job.title}</Text>
            <Text mt="sm">Description: {job.description}</Text>
            <Text mt="sm">Location: {job.location}</Text>
            <Text mt="sm">Price: {job.price}</Text>
            <Text mt="sm">Status: {job.status}</Text>
            <Text mt="sm">Positions: {job.positions || 1}</Text>
        </Box>
    );
}
