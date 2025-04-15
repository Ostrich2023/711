import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { getUserInfo } from "../../services/api"; //  api.js
// Mantine
import { Anchor, Button, Checkbox, Paper, PasswordInput, Text, TextInput, Title, } from '@mantine/core';
import classes from './AuthenticationImage.module.css';
// Router
import { useNavigate } from 'react-router-dom';

export function AuthenticationImage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      //  Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //  Firebase ID Token
      const token = await user.getIdToken();

      // api/user/info
      const data = await getUserInfo(token);

      console.log("back from firebase：", data);
      alert(`weclome  back，${data.email}`);

    } catch (error) {
      console.error("erro：", error.message);
      alert(error.message);
    }
  };

  const handleGoToRigister =()=>{
    navigate('/')
  }

  return (<div className={classes.wrapper}>
    <Paper className={classes.form} radius={0} p={30}>
      <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
        Welcome back to Skivy!
      </Title>

      {/* Email */}
      <TextInput 
      label="Email address" 
      placeholder="Your email address" 
      size="md" 
      onChange={(e) => setEmail(e.target.value)}/>
      {/* Password */}
      <PasswordInput 
      label="Password" 
      placeholder="Your password" 
      mt="md" size="md" 
      onChange={(e) => setPassword(e.target.value)}/>

      <Checkbox label="Keep me logged in" mt="xl" size="md"/>

      <Button fullWidth mt="xl" size="md" onClick={() => login()}>
        Login
      </Button>

      <Text ta="center" mt="md">
        Don&apos;t have an account?{' '}
        <Anchor href="#" fw={700} onClick={(event) => {event.preventDefault(); handleGoToRigister()}}>
          Register
        </Anchor>
      </Text>

    </Paper>
  </div>);
}

export default AuthenticationImage