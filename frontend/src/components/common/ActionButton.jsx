import { ActionIcon } from '@mantine/core';

export default function Demo(props) {
  return (
    <ActionIcon 
    size={42} 
    radius="xl"
    variant="default" 
    aria-label="ActionIcon with size as a number"
    onClick={props.onActionButton}>

      {props.icon}

    </ActionIcon>
  );
}