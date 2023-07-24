import React, { useState } from "react";
import {
  ChakraProvider,
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

const initialConsumer: IConsumerInputModel = {
    fullname: "",
    nif: "",
    sex: "M",
    dateofbirth: "",
    contact: 0,
  };
  
  export default function ConsumerCreation(): React.ReactElement {
    const [consumer, setConsumer] = useState<IConsumerInputModel>(initialConsumer);
    const { addToast, isToastActive } = useGlobalToast() 
    const navigate = useNavigate()
  
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
  
      setConsumer((prevConsumer) => ({
        ...prevConsumer,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const resp = await createConsumer(consumer).catch(err => {
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
          <Box className="bg-slate-800 shadow-slate-600 rounded-lg shadow-md p-6 gap-4">
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-center text-3xl font-bold text-white">Criar Provador</h1>
            </div>
            <div className="flex flex-row justify-between gap-3">
            <FormControl id="id">
              <FormLabel textColor="white">ID</FormLabel>
              <Input
                name="id"
                type="number"
                min={1}
                value={consumer.id || ""}
                onChange={handleInputChange}
                background="white"
              />
            </FormControl>  

            <FormControl id="fullname" isRequired>
              <FormLabel textColor="white">Full Name</FormLabel>
              <Input
                name="fullname"
                type="text"
                maxLength={200}
                value={consumer.fullname}
                onChange={handleInputChange}
                background="white"
              />
            </FormControl>
            </div>
            
            <div className="flex flex-row justify-between gap-3">
              <FormControl id="nif" isRequired>
                <FormLabel textColor="white">NIF</FormLabel>
                <Input
                  name="nif"
                  type="text"
                  maxLength={15}
                  value={consumer.nif}
                  onChange={handleInputChange}
                  background="white"
                />
              </FormControl>
      
              <FormControl id="sex" isRequired>
                <FormLabel textColor="white">Sex</FormLabel>
                <Select
                  name="sex"
                  value={consumer.sex}
                  onChange={handleInputChange}
                  background="white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </Select>
              </FormControl>
            </div>
            
            
            <div className="flex flex-row justify-between gap-3">
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
            </FormControl>
            <Button type="submit" mt={4} colorScheme="blue">
              Criar
            </Button>
            </Box>
          </form>
        </div>
      );
    };