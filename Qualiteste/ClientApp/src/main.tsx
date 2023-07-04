import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createStandaloneToast } from '@chakra-ui/react'

const {ToastContainer, toast} = createStandaloneToast()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
        <ToastContainer />
    </React.StrictMode>
)
toast({
    title: 'An error occurred.',
    description: 'Unable to create user account.',
    status: 'error',
    duration: 9000,
    isClosable: true,
  })