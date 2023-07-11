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
        <Box p={4}>
          <form onSubmit={handleSubmit}>
            <FormControl id="id">
              <FormLabel>ID</FormLabel>
              <Input
                name="id"
                type="number"
                min={1}
                value={consumer.id || ""}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <FormControl id="fullname" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullname"
                type="text"
                maxLength={200}
                value={consumer.fullname}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <FormControl id="nif" isRequired>
              <FormLabel>NIF</FormLabel>
              <Input
                name="nif"
                type="text"
                maxLength={15}
                value={consumer.nif}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <FormControl id="sex" isRequired>
              <FormLabel>Sex</FormLabel>
              <Select
                name="sex"
                value={consumer.sex}
                onChange={handleInputChange}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </Select>
            </FormControl>
    
            <FormControl id="dateofbirth" isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="dateofbirth"
                type="date"
                value={consumer.dateofbirth}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <FormControl id="contact" isRequired>
              <FormLabel>Contact</FormLabel>
              <Input
                name="contact"
                type="number"
                min={0}
                value={consumer.contact}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={consumer.email || ""}
                onChange={handleInputChange}
              />
            </FormControl>
    
            <Button type="submit" mt={4} colorScheme="blue">
              Submit
            </Button>
          </form>
        </Box>
      );
    };