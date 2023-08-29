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
import { ProductInputModel, ProductOutputModel } from '../../common/Interfaces/Products';
import { queryProducts, getAvailableBrands } from '../../common/APICalls';
import ProductsTable from '../tables/ProductsTable';
import CreateProductModal from './CreateProductModal';
import FilterBar from '../FilterBar';

type ModalProps = {
    onClickProduct? : (product : ProductOutputModel) => void
    onClickCreateProduct : (product : ProductInputModel) => void
    buttonText? : string
    excludeProducts? : ProductOutputModel[]
}

export default function AddProductsModal({onClickProduct, buttonText, onClickCreateProduct, excludeProducts} : ModalProps, ) : React.ReactElement {
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [brands, setBrands] = useState<string[]|undefined>(undefined)
    const [brandFilter, setBrandFilter] = useState<string|undefined>(undefined)
    const [searchString, setSearchString] = useState<string|undefined>(undefined)
    useEffect(() => {
        populateData() 
      }, [excludeProducts, searchString, brandFilter]);
    
    async function populateData() {
        const filters = Object.assign(
            {},
            brandFilter === undefined? null : {brand: brandFilter},
            searchString === undefined ? null : {designation: searchString}
        )
        const response = await queryProducts(filters)
        const availableBrands = await getAvailableBrands()
        if(excludeProducts != undefined) {
            const aux = response.data as ProductOutputModel[]
            const result = aux.filter(e => excludeProducts.findIndex(p => p.productid == e.productid) == -1)
            setProducts(result)
        }else setProducts(response.data)
        setBrands(availableBrands.data.brands)
        
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
                >{buttonText !== undefined ? (buttonText) : ("Adicionar produto existente")}
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
                            <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow items-center justify-center">
                            <div className="w-full">
                            <FilterBar brands={brands} setBrand={setBrandFilter} setSearchString={setSearchString} searchBar />
                            </div>
                            <div className="mt-3 w-full" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
                            <ProductsTable products={products} onClickProduct={handleClick}/>
                            </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <CreateProductModal onSubmit={onClickCreateProduct}/>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}