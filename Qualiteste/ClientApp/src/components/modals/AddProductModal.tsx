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
import ProductsTable from '../tables/ProductsTable';

type ModalProps = {
    onClickProduct? : (product : ProductOutputModel) => void
}

export default function AddProductsModal({onClickProduct} : ModalProps) : React.ReactElement {
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        populateData() 
      }, []);
    
    async function populateData() {
        const filters = { brandName : undefined } 
        const response = await queryProducts(filters.brandName)
        setProducts(response.data)
    }

    function handleClick(product : ProductOutputModel) {
        if(onClickProduct) onClickProduct(product)
        onClose()
    }
    return(
        <div className='h-fit'>
            <Button
                onClick={onOpen}
                m={4}
                >{`Adicionar Produto existente`}
            </Button>
            <Modal onClose={onClose} size="5xl" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicione Produtos</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {products === null ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                                <ProductsTable products={products} onClickProduct={handleClick}/>
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