import React, { useState } from 'react';
import { Box, Button, ChakraProvider, Container, FormControl, FormLabel, Image, Input, Stack, useToast } from '@chakra-ui/react';
import { changeInstanceToken, loginUser } from '../../common/APICalls';
import { useNavigate } from 'react-router-dom';
import { useGlobalToast } from '../../common/useGlobalToast';

export default function Login() : React.ReactElement  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined)
  const { addToast, isToastActive } = useGlobalToast() 
  const navigate = useNavigate()
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    const resp = await loginUser(username, password).catch(err => {
      setErrorMessage(err.response.data.title)
    })
    if(resp.status == 200){
      const token = resp.data
      localStorage.setItem("QualitesteToken", token)
      changeInstanceToken()
      const toastObj = {id: "success", title: "Sucesso", description: "Autenticação realizada com sucesso.", status: "success"}
      navigate("/", {state : toastObj})
    }
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
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <Button type="submit" colorScheme="blue" isFullWidth>Login</Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

