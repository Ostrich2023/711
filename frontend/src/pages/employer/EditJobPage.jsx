import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Box,
  Title,
  Badge,
  Text,
  MultiSelect,
  Loader,
  Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchJobById, updateJob, findStudentsBySkill, assignJob } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { fetchSoftSkills } from '../../services/jobService';


const EditJobPage = () => {
  const { token } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentSkill, setCurrentSkill] = useState('');
  const [softSkillOptions, setSoftSkillOptions] = useState([]);
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      location: '',
      price: 0,
      skills: [],
      softSkills: [],
      assignments: [], // needed for tracking student assignment status
    },
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await fetchJobById(jobId, token);

        // Set form values
        form.setValues(job);


        const softSkillsFromDB = await fetchSoftSkills(token);
        setSoftSkillOptions(softSkillsFromDB.map(s => ({ value: s.id, label: s.name })));

        // All assignments (including rejected ones)
        const allAssignments = job.assignments || [];

        // Set read-only if any assignment is not rejected or job is verified
        const nonRejected = allAssignments.filter(a => a.status !== 'rejected');
        if (nonRejected.length > 0 || job.verified === true) {
          setIsReadOnly(true);
        }

        // Store assigned students with their statuses
        const assignedStudentsWithStatus = allAssignments
          .filter(a => a.student)
          .map(a => ({
            ...a.student,
            status: a.status,
          }));

        setAssignedUsers(assignedStudentsWithStatus);

        // Load matched students
        for (const skill of job.skills || []) {
          try {
            const students = await findStudentsBySkill(skill, token);
            setMatchedStudents(prev => {
              const combined = [...prev, ...students];
              const unique = [...new Map(combined.map(s => [s.id, s])).values()];
              return unique;
            });
          } catch (err) {
            console.error(`Error finding students for skill "${skill}":`, err);
          }
        }
      } catch (err) {
        console.error('Failed to load job', err);
        alert('Job not found or access denied.');
        navigate('/employer/jobs-list');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, token]);

  const handleAddSkill = () => {
    const trimmed = currentSkill.trim();
    if (trimmed && !form.values.skills.includes(trimmed)) {
      form.setFieldValue('skills', [...form.values.skills, trimmed]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    form.setFieldValue(
      'skills',
      form.values.skills.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values) => {
    try {
      await updateJob(jobId, values, token);
      alert('Job updated successfully');
      navigate('/employer/jobs-list', { state: { reload: true } });
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update job.');
    }
  };

  if (loading) {
    return <Center mt="lg"><Loader /></Center>;
  }

  return (
    <Container style={{ maxWidth: '100%', width: '100%' }}>
      <Title order={2} mb="md">Edit Job</Title>

      {isReadOnly && (
        <Text c="red" mb="sm">
          This job cannot be edited because at least one student has accepted, is assigned, or it is verified.
        </Text>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          required
          disabled={isReadOnly}
          {...form.getInputProps('title')}
        />
        <Textarea
          label="Description"
          required
          mt="md"
          minRows={4}
          disabled={isReadOnly}
          {...form.getInputProps('description')}
        />
        <TextInput
          label="Location"
          required
          mt="md"
          disabled={isReadOnly}
          {...form.getInputProps('location')}
        />
        <NumberInput
          label="Price"
          required
          disabled={isReadOnly}
          mt="md"
          min={0}
          {...form.getInputProps('price')}
        />

        <TextInput
          label="Add Skill"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          disabled={isReadOnly}
          mt="md"
        />
        {!isReadOnly && <Button mt="sm" onClick={handleAddSkill}>Add Skill</Button>}

        <Group mt="sm" spacing="xs">
          {form.values.skills.map((skill, index) => (
            <Badge
              key={index}
              rightSection={
                <span
                  style={{ cursor: 'pointer', marginLeft: 8 }}
                  onClick={() => handleRemoveSkill(index)}
                >
                  {!isReadOnly && <Text>×</Text>}
                </span>
              }
            >
              {skill}
            </Badge>
          ))}
        </Group>

        <MultiSelect
          label="Soft Skills"
          placeholder="Select soft skills"
          data={softSkillOptions}
          value={form.values.softSkills}
          onChange={(value) => form.setFieldValue('softSkills', value)}
          disabled={isReadOnly}
          searchable
          clearable
          mt="lg"
        />        

        <Button type="submit" mt="xl" fullWidth disabled={isReadOnly}>Update Job</Button>
      </form>

      {matchedStudents.length > 0 && (
        <Box mt="xl">
          <Title order={4}>Matching Students</Title>
          <Group mt="md" spacing="md">
            {matchedStudents.map((student) => {
              const assignment = (form.values.assignments || []).find(
                (a) => a.studentId === student.id
              );
              const alreadyAssigned = assignment && assignment.status !== 'rejected';
              const wasRejected = assignment && assignment.status === 'rejected';

              return (
                <Box key={student.id} p="sm" shadow="sm" radius="md" withBorder style={{ width: '100%' }}>
                  <Text fw={600}>{student.name || student.email}</Text>
                  <Text size="sm" c="dimmed">Skills: {(student.skills || []).join(', ')}</Text>
                  <Button
                    mt="sm"
                    size="xs"
                    disabled={alreadyAssigned || wasRejected}
                    onClick={async () => {
                      try {
                        await assignJob(jobId, student.id, token);
                        alert(`Job assigned to ${student.name || student.email}`);
                        navigate('/employer/jobs-list', { state: { reload: true } });
                      } catch (err) {
                        alert('Failed to assign job');
                      }
                    }}
                  >
                    Assign Job
                  </Button>
                </Box>
              );
            })}
          </Group>
        </Box>
      )}

      {assignedUsers.length > 0 && (
        <Box mt="xl">
          <Title order={4}>Assigned Students</Title>
          <Group mt="md" spacing="md">
            {assignedUsers.map((student, idx) => (
              <Box key={idx} p="sm" shadow="sm" radius="md" withBorder>
                <Text fw={600}>{student.name || student.email}</Text>
                <Text size="sm" c="dimmed">Email: {student.email}</Text>
                <Text size="sm" c="dimmed">School Name: {student.schoolName || 'N/A'}</Text>
                <Text size="sm" c={student.status === 'rejected' ? 'red' : 'blue'}>
                  Status: <b>{student.status}</b>
                </Text>
              </Box>
            ))}
          </Group>
        </Box>
      )}
    </Container>
  );
};

export default EditJobPage;
