import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Group, Image, List, Text, ThemeIcon, Title } from '@mantine/core';
import image from '../assets/home.png';
import classes from './Home.module.css';

export default function Home() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>smarter</span> way to <br /> manage your digital skills
          </Title>
          <Text c="dimmed" mt="md">
            Skivy helps students, teachers, and employers collaborate to track, verify, and showcase learning outcomes — all in one place.
          </Text>
  
          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Student-centered</b> – request, manage, and display verified academic and technical skills
            </List.Item>
            <List.Item>
              <b>Teacher verified</b> – educators can approve and certify soft/hard skills through the platform
            </List.Item>
            <List.Item>
              <b>Employer ready</b> – showcase your skills to potential employers and apply for relevant opportunities
            </List.Item>
          </List>
  
          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Source code
            </Button>
          </Group>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}
