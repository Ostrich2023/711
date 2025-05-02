import { IconChevronRight, IconHeart, IconLogout, IconMessage, IconHome2, IconSettings, IconStar, IconSwitchHorizontal, IconTrash, } from '@tabler/icons-react';
import { Avatar, Group, Menu, Text, useMantineTheme } from '@mantine/core';

import { useNavigate } from "react-router-dom";

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; 
import { useAuth } from '../../context/AuthContext';

export default function UserMenu(props) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { setUser, setRole, role} = useAuth();

  // Handle logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      setUser(null);       // Clear user state  
      setRole(null);       // Clear role state
      navigate('/login');   // Redirect to login page
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout');
    }
  };

  const handleGoHome =()=>{
    if(role==='student'){
      navigate('/student');
    }
    else if(role==='school'){
      navigate('/school')
    }
    else if(role==='employer'){
      navigate('/employer')
    }
  }
  return (
  <Group justify="center">
    <Menu withArrow width={200} position="bottom" transitionProps={{ transition: 'pop' }} withinPortal>
      <Menu.Target>
        <Group>
          <Text fw={500} color="#575757">Hi, {props.userData?.name}</Text>
          <Avatar name={props.userData?.name} color="initials" radius="xl">
            {props.userData?.name?.slice(0, 2).toUpperCase()}
          </Avatar>
        </Group>
        </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item rightSection={<IconChevronRight size={16} stroke={1.5}/>}>
          <Group onClick={handleGoHome}>
          <div>
            <Text fw={500}>{props.userData?.name}</Text>
            <Text size="xs" c="dimmed">
            {props.userData?.email}
            </Text>
          </div>
          </Group>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconSettings size={16} stroke={1.5}/>}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconLogout size={16} stroke={1.5}/>} onClick={handleLogout}>Logout</Menu.Item>

      </Menu.Dropdown>

    </Menu>
  </Group>);
}