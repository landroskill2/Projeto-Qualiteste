import {
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
import React, { useEffect, useState } from 'react'
import { ProductOutputModel } from '../../common/Interfaces/Products';
import { queryProducts } from '../../common/APICalls';

type ModalProps = {
    onClickTest : (id : string) => void
}

export default function AddProductsModal({onClickTest} : ModalProps) : React.ReactElement {
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        populateData() 
      }, []);
    
      async function populateData() {
        const filters = { type : "SP" }
      
          const response = await (filters)
          setTests(response.data)
      }

    return(
        <div className='h-fit'>
            <Button
                onClick={onOpen}
                m={4}
                >{`Adicionar Teste`}
            </Button>
            <Modal onClose={onClose} size="5xl" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicione Testes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {tests === null ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                                <TestsTable tests={tests} onClickTest={onClickTest}/>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}