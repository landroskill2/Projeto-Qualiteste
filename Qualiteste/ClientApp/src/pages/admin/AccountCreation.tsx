import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";

import { useGlobalToast } from "../../common/useGlobalToast";
import { useNavigate } from "react-router-dom";
import IAccountOutput from "../../common/Interfaces/Accounts";
import { registerUser } from "../../common/APICalls";

const initialAccount : IAccountOutput = {
    username : "",
    password : "",
    role : "ADMIN"
}

type ClientAttributes = {
    id : string,
    name : string
}

const initialClient : ClientAttributes = {
    id : "",
    name : ""
}
  
  export default function AccountCreation(): React.ReactElement {
    const [accountCredentials, setAccountCredentials] = useState<IAccountOutput>(initialAccount);
    const [clientAttributes, setClientAttributes] = useState<ClientAttributes>(initialClient)
    const { addToast, isToastActive } = useGlobalToast() 
    const navigate = useNavigate()
  
    const handleAccountInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
  
      setAccountCredentials((prevAccountCredentials) => ({
        ...prevAccountCredentials,
        [name]: value,
      }));
    };

    const handleClientInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value} = e.target
        setClientAttributes((prevClientAttributes) => ({
          ...prevClientAttributes,
          [name] : value
        }))
      }
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const resp = await registerUser(accountCredentials).catch(err => {
        console.log(err)
        if(!isToastActive("error")){
          addToast({
            id: "error",
            title: "Erro",
            description: err.response.data.title,
            status: "error"
          })
        }
      })
      if(resp?.status === 201){
        const toastObj = {id: "success", title: "Sucesso", description: "Provador criado com sucesso.", status: "success"}
        const location = resp!.headers.location.split("/api")[1]
        navigate(location, {state: toastObj})
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
         <form onSubmit={handleSubmit}>
          <Box className="bg-slate-800 shadow-slate-600 rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-center text-3xl font-bold text-white">Criar Conta</h1>
            </div>
            <div className="flex flex-row justify-between gap-3">
            <FormControl id="username" isRequired>
              <FormLabel textColor="white">Username</FormLabel>
              <Input
                name="username"
                type="text"
                min={4}
                value={accountCredentials.username}
                onChange={handleAccountInputChange}
                background="white"
              />
            </FormControl>  

            <FormControl id="password" isRequired>
              <FormLabel textColor="white">Password</FormLabel>
              <Input
                name="password"
                type="password"
                maxLength={16}
                value={accountCredentials.password}
                onChange={handleAccountInputChange}
                background="white"
              />
            </FormControl>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <FormControl id="role" isRequired>
                <FormLabel textColor="white">Tipo de conta</FormLabel>
                <Select
                  name="role"
                  value={accountCredentials.role}
                  onChange={handleAccountInputChange}
                  background="white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="CLIENT">Cliente</option>
                </Select>
              </FormControl>
            </div>
            
            {accountCredentials.role == "CLIENT" && 
              <div className="flex flex-row justify-between gap-3">
                <FormControl id="id" isRequired>
                  <FormLabel textColor="white">ID de cliente</FormLabel>
                  <Input
                    name="id"
                    type="text"
                    min={1}
                    value={clientAttributes.id}
                    onChange={handleClientInputChange}
                    background="white"
                  />
                </FormControl>  
    
                <FormControl id="name" isRequired>
                  <FormLabel textColor="white">Designação de cliente</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    maxLength={40}
                    value={clientAttributes.name}
                    onChange={handleClientInputChange}
                    background="white"
                  />
                </FormControl>
              </div>
            }
          
            <Button type="submit" mt={4} colorScheme="blue">
              Criar
            </Button>
            </Box>
          </form>
        </div>
      );
    };