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
import { ProductInputModel } from "../../common/Interfaces/Products"
import { useGlobalToast } from "../../common/useGlobalToast";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../common/APICalls";

const initialProduct : ProductInputModel = {
    ref : "",
    designation : "",
    brand : ""
}



export default function ProductCreation() : React.ReactElement {
    const [product, setProduct] = useState<ProductInputModel>(initialProduct)
    const { addToast, isToastActive } = useGlobalToast() 
    const navigate = useNavigate()


    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const resp = await createProduct(product).catch(err => {
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
            const toastObj = {id: "success", title: "Sucesso", description: resp.data, status: "success"}
            const location = "/products"
            navigate(location, {state: toastObj})
        }
    }
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
    
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value,
        }));
      };
    console.log(product)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white ">
            <form onSubmit={handleSubmit}>
                <Box className="bg-slate-800 shadow-slate-600 rounded-lg shadow-md p-6 gap-4">
                    <div className="flex flex-col items-center justify-start mb-4">
                        <h1 className="text-center text-3xl font-bold text-white">Criar Produto</h1>
                    </div>
                    <div className="flex flex-grow flex-col justify-between gap-3">
                        <FormControl id="id" isRequired>
                            <FormLabel textColor="white">Referência</FormLabel>
                            <Input
                                name="ref"
                                type="text"
                                value={product.ref || ""}
                                onChange={handleInputChange}
                                background="white" />
                        </FormControl>

                        <FormControl id="id" isRequired>
                            <FormLabel textColor="white">Designação</FormLabel>
                            <Input
                                name="designation"
                                type="text"
                                value={product.designation || ""}
                                onChange={handleInputChange}
                                background="white" />
                        </FormControl>

                        <FormControl id="id" isRequired>
                            <FormLabel textColor="white">Marca</FormLabel>
                            <Input
                                name="brand"
                                type="text"
                                value={product.brand || ""}
                                onChange={handleInputChange}
                                background="white" />
                        </FormControl>
                        <div className="flex justify-center">
                        <Button type="submit" mt={4} colorScheme="blue">
                            Criar
                        </Button>
                        </div>
                        
                    </div>
                </Box>
            </form>
        </div>
    )
}