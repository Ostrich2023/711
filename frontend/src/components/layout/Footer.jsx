import { Anchor, Container, Group, Image } from '@mantine/core';
import classes from './Footer.module.css';
import logo from '../../../public/favicon.ico';

const links = [
    { link: '#', label: 'Contact' },
    { link: '#', label: 'Privacy' },
    { link: '#', label: 'Blog' },
    { link: '#', label: 'Careers' },
];

export default function Footer() {
    const items = links.map((link) => (
    <Anchor c="dimmed" key={link.label} href={link.link} onClick={(event) => event.preventDefault()} size="sm">
      {link.label}
    </Anchor>));
    return (<div className={classes.footer}>
      <Container className={classes.inner}>
        <Image src={logo} w="90px"></Image>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>);
}