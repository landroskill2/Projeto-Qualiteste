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
import { useEffect } from "react";
import IAccountOutput from "../../common/Interfaces/Accounts";
import { fetchAllClients, registerUser } from "../../common/APICalls";

const initialAccount : IAccountOutput = {
    username : "",
    password : "",
    role : "ADMIN",
    id : "",
    designation : ""
}

interface IClientOutputModel {
  clientId : string,
  clientDesignation : string,
}
  
  export default function AccountCreation(): React.ReactElement {
    const [accountCredentials, setAccountCredentials] = useState<IAccountOutput>(initialAccount);
    const [clientSelected, setClientSelected] = useState<boolean>(false)
    const [availableClients, setAvailableClients] = useState<IClientOutputModel[]>()
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


    useEffect(()=> {
      populateData()
    }, [])


    async function populateData(){
      const resp = await fetchAllClients().catch(err => {
        if(!isToastActive("error")){
          addToast({
            id: "error",
            title: "Erro",
            description: err.response.data.title,
            status: "error"
          })
        }
      })
      if(resp?.status == 200){
        setAvailableClients(resp.data)
      }
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
      if(resp?.status=== 201){
        const toastObj = {id: "success", title: "Sucesso", description: resp.data.message, status: "success"}
        navigate("/admin", {state: toastObj})
      }
    };
    console.log(clientSelected)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
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
            <>
            {!clientSelected &&
              <div className="flex flex-row justify-between gap-3">
                <FormControl id="id" isRequired>
                  <FormLabel textColor="white">ID de cliente</FormLabel>
                  <Input
                    name="id"
                    type="text"
                    min={1}
                    value={accountCredentials.id}
                    onChange={handleAccountInputChange}
                    background="white"
                  />
                </FormControl>  

                <FormControl id="designation" isRequired>
                  <FormLabel textColor="white">Designação de cliente</FormLabel>
                  <Input
                    name="designation"
                    type="text"
                    maxLength={40}
                    value={accountCredentials.designation}
                    onChange={handleAccountInputChange}
                    background="white"
                  />
                </FormControl>
              </div>
          }
              <div className="flex flex-col justify-between">
                  <FormLabel textColor="white">Associar a um cliente existente</FormLabel>
                  <Select 
                    name="id"
                    value={accountCredentials.id}
                    onChange= { e => {setClientSelected(e.target.value === ""? false : true);handleAccountInputChange(e)}}
                    background="white"
                    >
                      <option value={""}>Escolher</option>
                    {availableClients?.map(c =>
                      <option value={c.clientId}>
                          {c.clientDesignation}
                      </option>
                      
                      
                    )}
                  </Select>
                </div>
            </>
            }
            <Button type="submit" mt={4} colorScheme="blue" onSubmit={handleSubmit}>
              Criar
            </Button>
            </Box>
          </form>
        </div>
      );
    };