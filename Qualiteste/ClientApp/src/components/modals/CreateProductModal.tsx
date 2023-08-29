import React, { useState } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Spinner,
  } from '@chakra-ui/react'
import { ProductInputModel } from "../../common/Interfaces/Products"

type ModalProps = {
    onSubmit : (product : ProductInputModel) => void
}

const initialProduct : ProductInputModel = {
    ref : "",
    designation : "",
    brand : ""
}



export default function CreateProductModal({onSubmit} : ModalProps) : React.ReactElement {
    const [product, setProduct] = useState<ProductInputModel>(initialProduct)
    const { isOpen, onOpen, onClose } = useDisclosure()


    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        console.log("on handleSubmit")
        e.preventDefault()
        onSubmit(product)
        onClose()   
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
    return (
        <div >
        <Button
            colorScheme="blue"
            onClick={onOpen}
            m={4}
            >{`Criar Produto`}
        </Button>
        <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader className="bg-slate-800 shadow-slate-600 shadow-md p-6 gap-4 text-white rounded-t-md" >Criar Produto</ModalHeader>
                <ModalCloseButton color={"white"} />
                <ModalBody className="bg-slate-800 shadow-slate-600 shadow-md p-6 gap-4 rounded-b-md">
                <div>
            <form onSubmit={handleSubmit}>
                <Box>
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
            </ModalBody>
            </ModalContent>
        </Modal>
    </div>
    )
}