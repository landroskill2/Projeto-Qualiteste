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

const initialProduct : ProductInputModel = {
    productid : 0,
    designation : "",
    brand : ""
}



export default function ProductCreation() : React.ReactElement {
    const [product, setProduct] = useState<ProductInputModel>(initialProduct)
    const { addToast, isToastActive } = useGlobalToast() 


    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        console.log("Request Creation")
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
                    <div className="flex flex-grow justify-between gap-3">
                        <FormControl id="id">
                            <FormLabel textColor="white">ID</FormLabel>
                            <Input
                                name="productid"
                                type="number"
                                min={0}
                                value={product.productid || 0}
                                onChange={handleInputChange}
                                background="white"/>
                        </FormControl>
                    </div>
                </Box>
            </form>
        </div>
    )
}