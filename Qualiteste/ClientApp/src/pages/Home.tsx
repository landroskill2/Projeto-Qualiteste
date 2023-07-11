import React, { Component, useEffect } from 'react';
import { useGlobalToast } from '../common/useGlobalToast';
import { useLocation } from 'react-router-dom';
import { Box, Container, Image } from '@chakra-ui/react';


export function Home() : React.ReactElement {

  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()

  useEffect(() => {
    
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }
  }, [])

    return (
      <Box height="50vh" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="lg" rounded="md">
        <img
          src="../../../public/qualiteste.png"
          alt="Logo"
          className="text-white cursor-pointer"
          id="nav-title"
          mx="auto"
          width="100%" 
          height="100%" 
        />
        </Container>
        </Box>
    );
}
