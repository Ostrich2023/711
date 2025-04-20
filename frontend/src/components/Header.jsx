import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Burger, Container, Group, Image, Button, Avatar, Text, Drawer} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from "../context/AuthContext";
import classes from './Header.module.css';
import logo from '../../public/favicon.ico';
import Navbar from './Navbar';

const links = [
    { link: '/about', label: 'Features' },
    { link: '/pricing', label: 'Pricing' },
    { link: '/learn', label: 'Learn' },
    { link: '/community', label: 'Community' },
];

export default function Header() {
  const navigate = useNavigate();

  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const { user } = useAuth();

  const items = links.map((link) => (
  <a 
    key={link.label} 
    href={link.link} 
    className={classes.link} 
    data-active={active === link.link || undefined} 
    onClick={(event) => {
      event.preventDefault();
      setActive(link.link);
      navigate(link.link);
      }}>
    {link.label}
  </a>));

  // This is the navbar that will be displayed on mobile devices
  const [navbarOpened, setNavbarOpened] = useState(false);

  return (
  <header className={classes.header}>
    <Container fluid className={classes.inner}>
      
    <Drawer
      opened={navbarOpened}
      onClose={() => setNavbarOpened(false)}
      position="right"
      size={80}
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
          overflow: 'hidden',
        },
        content: {
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#fff',
        },
      }}
    >
      <Navbar />
    </Drawer>

      <Image src={logo} w="90px"></Image>

      <Group gap={5} visibleFrom="xs">
        {items}
      </Group>

      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
        {/*  Determine whether user are logged in and display different content */}
        {!user ? (
          <Button variant="default" color="gray" radius="xl" onClick={() => navigate("/login")}>
            Sign in
          </Button>
        ) : (
          <Group>
            <Text fw={500} color="#575757">Hi, {user.displayName || user.name || "User"}</Text>
            <Avatar name={user.name} color="initials" radius="xl" onClick={() => setNavbarOpened(true)}>
              {user.name?.slice(0, 2).toUpperCase()}
            </Avatar>
          </Group>

        )}
    </Container>
  </header>);
}
