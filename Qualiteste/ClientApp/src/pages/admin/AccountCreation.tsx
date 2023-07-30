import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { IConsumerInputModel } from "../../common/Interfaces/Consumers";
import { createConsumer } from "../../common/APICalls";
import { useGlobalToast } from "../../common/useGlobalToast";
import { useNavigate } from "react-router-dom";

type AccountCredentials = {
    username: string,
    password: string,
    type: "ADMIN" | "CLIENT"
}

const initialAccount : AccountCredentials = {
    username : "",
    password : "",
    type : "ADMIN"
}
  
  export default function AccountCreation(): React.ReactElement {
    const [accountCredentials, setAccountCredentials] = useState<AccountCredentials>(initialAccount);
    const { addToast, isToastActive } = useGlobalToast() 
    const navigate = useNavigate()
  
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
  
      setAccountCredentials((prevAccountCredentials) => ({
        ...prevAccountCredentials,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();
    //   const resp = await createConsumer(consumer).catch(err => {
    //     console.log(err)
    //     if(!isToastActive("error")){
    //       addToast({
    //         id: "error",
    //         title: "Erro",
    //         description: err.response.data.title,
    //         status: "error"
    //       })
    //     }
    //   })
    //   if(resp?.status === 201){
    //     const toastObj = {id: "success", title: "Sucesso", description: "Provador criado com sucesso.", status: "success"}
    //     const location = resp!.headers.location.split("/api")[1]
    //     navigate(location, {state: toastObj})
    //   }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
         <form onSubmit={handleSubmit}>
          <Box className="bg-slate-800 shadow-slate-600 rounded-lg shadow-md p-6 gap-4">
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-center text-3xl font-bold text-white">Criar Conta</h1>
            </div>
            <div className="flex flex-row justify-between gap-3">
            <FormControl id="username" isRequired>
              <FormLabel textColor="white">Username</FormLabel>
              <Input
                name="username"
                type="text"
                min={1}
                value={accountCredentials.username}
                onChange={handleInputChange}
                background="white"
              />
            </FormControl>  

            <FormControl id="password" isRequired>
              <FormLabel textColor="white">Password</FormLabel>
              <Input
                name="password"
                type="password"
                maxLength={200}
                value={accountCredentials.password}
                onChange={handleInputChange}
                background="white"
              />
            </FormControl>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <FormControl id="type" isRequired>
                <FormLabel textColor="white">Tipo de conta</FormLabel>
                <Select
                  name="type"
                  value={accountCredentials.type}
                  onChange={handleInputChange}
                  background="white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="CLIENT">Cliente</option>
                </Select>
              </FormControl>
            </div>
            
            
            {/* <div className="flex flex-row justify-between gap-3">
              <FormControl id="dateofbirth" isRequired>
                <FormLabel textColor="white">Date of Birth</FormLabel>
                <Input
                  name="dateofbirth"
                  type="date"
                  value={consumer.dateofbirth}
                  onChange={handleInputChange}
                  background="white"
                />
              </FormControl>
      
              <FormControl id="contact" isRequired>
                <FormLabel textColor="white">Contact</FormLabel>
                <Input
                  name="contact"
                  type="text"
                  value={consumer.contact}
                  onChange={handleInputChange}
                  background="white"
                />
              </FormControl>   
            </div>
            
            <FormControl className="grid-span-full" id="email">
              <FormLabel textColor="white">Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={consumer.email || ""}
                onChange={handleInputChange}
                background="white"
              />
            </FormControl> */}
            <Button type="submit" mt={4} colorScheme="blue">
              Criar
            </Button>
            </Box>
          </form>
        </div>
      );
    };