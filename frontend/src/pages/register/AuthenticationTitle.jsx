// registration
// The first page for new user registration, where the user only submits their email and password to Firebase

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ethers } from "ethers";
import { auth, db } from "../../firebase.js";
// Mantine
import { Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Text, TextInput, Title, } from '@mantine/core';
import classes from './AuthenticationTitle.module.css';
// Router
import { useNavigate } from 'react-router-dom';

export function AuthenticationTitle() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      // register(only email/passwaord)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const wallet = ethers.Wallet.createRandom();

      // Save user data and wallet address to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        walletAddress: wallet.address,
        // Do NOT store mnemonic in production
      });

      alert(
        `✅ Wallet created!\n\nAddress: ${wallet.address}\n\nMnemonic (keep this safe!):\n${wallet.mnemonic.phrase}`
      );
    } catch (error) {
      alert(`❌ Registration failed: ${error.message}`);
    }
  };
  
  const handleGoToLog =()=>{
    navigate('/login')
  }

  return (<Container size={420} my={40}>
    <Title ta="center" className={classes.title}>
      Welcome to Skivy!
    </Title>
    <Text size="lg" ta="center" mt={18} color="black">
      Create a new account{' '}
    </Text>

    <Paper withBorder shadow="md" p={30} mt={20} radius="md">
      {/* Email */}
      <TextInput 
      label="Email" 
      placeholder="Your Email address" 
      value={email}
      required onChange={(e) => setEmail(e.target.value)}/>
      {/* Password */}
      <PasswordInput 
      label="Password" 
      placeholder="Your password" 
      value={password}
      required mt="md" onChange={(e) => setPassword(e.target.value)}/>
      {/* Re-enter Password */}
      <PasswordInput 
      label="Re-enter Password" 
      placeholder="Confirm your password"
      required mt="md"onChange={(e) => setPassword(e.target.value)}/>

      <Group justify="space-between" mt="lg">
        <Checkbox label="I agree to the registration agreement"/>
      </Group>

      <Button fullWidth mt="lg" onClick={() => register()}>
        Next
      </Button>

      <Group mt="md" justify="center">
        <Text size="sm">Already have an account?</Text>
        <Anchor fw={700} component="button" size="sm" pl="1px" onClick={() => handleGoToLog()}>
           Login &nbsp;&nbsp;  
        </Anchor>
      </Group>

    </Paper>
  </Container>);
}


export default AuthenticationTitle;
