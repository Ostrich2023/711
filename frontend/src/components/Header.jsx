import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Burger, Container, Group, Image, Button} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import logo from '../../public/favicon.ico';

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
  const items = links.map((link) => (<a key={link.label} href={link.link} className={classes.link} data-active={active === link.link || undefined} onClick={(event) => {
          event.preventDefault();
          setActive(link.link);
      }}>
    {link.label}
  </a>));

  return (
  <header className={classes.header}>
    <Container fluid className={classes.inner}>
      <Image src={logo} w="90px"></Image>

      <Group gap={5} visibleFrom="xs">
        {items}
      </Group>

      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>

      <Button variant="default" color="gray" radius="xl" onClick={()=>navigate('/login')}>Sign in</Button>
    </Container>
  </header>);
}
