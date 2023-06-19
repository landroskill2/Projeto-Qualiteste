import React, { useState } from 'react';
import { Box, Button, ChakraProvider, Container, FormControl, FormLabel, Image, Input, Stack } from '@chakra-ui/react';
import { loginUser } from '../../common/APICalls';

export default function Login() : React.ReactElement  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    loginUser(username, password)
  }

  return (
    <ChakraProvider>
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="lg" boxShadow="lg" rounded="md" p={6}>
          <Box mx="auto" my={4} width="100%" height={32}>
            <Image src="..\..\..\public\qualiteste.png" alt="Logo" mx="auto" width="100%" height="100%" objectFit="cover" /> {/* Replace with your actual image */}
          </Box>
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input type="text"value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </FormControl>
              <Button type="submit" colorScheme="blue" isFullWidth>Login</Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

