import {
  Modal, Button, Group, Text, Avatar, Paper, Title, Image, Stack
} from '@mantine/core';

const submissions = [
  {
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    skill: 'React',
    detail: 'React Basics and component structure',
    extraInfo: 'Completed 3 React projects, submitted GitHub link and screenshot.',
    image: '/attachments/react-project.png',
    file: '/attachments/react-project-summary.pdf',
  },
];

export default function SkillVerifyModal(props){
  return(
    <>
    <Title order={2} mb="md">Verify Skill Submissions</Title>

    {submissions.map((s, i) => (
      <Paper key={i} p="md" mt="md" withBorder onClick={() => props.openModal(s)} style={{ cursor: 'pointer' }}>
        <Group>
          <Avatar src={s.avatar} radius="xl" />
          <div>
            <Text fw={700}>{s.name}</Text>
            <Text size="sm" c="dimmed">{s.email}</Text>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Text fw={700}>{s.skill}</Text>
            <Text size="sm" c="dimmed">{s.detail}</Text>
          </div>
        </Group>
      </Paper>
    ))}

    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title="Skill Submission Details"
      size="lg"
    >
      {props.selected && (
        <Stack>
          <Group>
            <Avatar src={props.selected.avatar} radius="xl" />
            <div>
              <Text fw={700}>{props.selected.name}</Text>
              <Text size="sm">{props.selected.email}</Text>
            </div>
          </Group>

          <Text fw={700}>Skill:</Text>
          <Text>{props.selected.skill}</Text>
          <Text size="sm" c="dimmed">{props.selected.detail}</Text>

          <Text fw={700} mt="sm">Additional Info:</Text>
          <Text>{props.selected.extraInfo}</Text>

          {props.selected.image && (
            <>
              <Text fw={700}>Screenshot:</Text>
              <Image src={props.selected.image} radius="md" maw={400} />
            </>
          )}

          {props.selected.file && (
            <Button component="a" href={props.selected.file} download variant="outline">
              Download Attachment
            </Button>
          )}

          <Group mt="md" position="right">
            <Button color="gray" onClick={props.handleReject}>Reject</Button>
            <Button color="green" onClick={props.handleApprove}>Approve</Button>
          </Group>
        </Stack>
      )}
    </Modal>
  </>
  )
}