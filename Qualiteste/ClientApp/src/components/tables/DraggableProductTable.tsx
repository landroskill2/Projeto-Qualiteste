import React from "react"
import {
    ChakraProvider,
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Table,
    Tbody,
    Tr,
    Td,
    Thead,
  } from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons"
import {ProductOutputModel} from "../../common/Interfaces/Products";

interface TableProperties {
    elements : ProductOutputModel[],
    setElements : React.Dispatch<React.SetStateAction<ProductOutputModel[]>>
    productToTest : number | undefined
}

export default function DraggableProductTable({elements, setElements, productToTest} : TableProperties) : React.ReactElement{

    const dragItem = React.useRef<any>(null)
    const dragOverItem = React.useRef<any>(null)


    const handleSort = () => {
        let _elements = [...elements]

        const draggedItemContent = _elements.splice(dragItem.current,1)[0]
        
        //switch position
        _elements.splice(dragOverItem.current, 0, draggedItemContent)

        //reset references
        dragItem.current = null
        dragOverItem.current = null

        setElements([..._elements])
    }

    const removeItem = (idx:number) => {
        let _elements = [...elements]

        _elements.splice(idx,1)

        setElements([..._elements])
    }


    return (
        <>
            <Table variant="simple" overflow="auto" size="sm">
                <Tbody onDragOver={(e) => e.preventDefault()}>
                    {elements && <>
                    {elements.map((p, idx) => (
                            <Tr key={p.productid}
                            className="flex cursor-move" 
                            draggable
                            onDragStart={() => {dragItem.current = idx}}
                            onDragOver={(e)=> e.preventDefault()}//
                            onDragEnter={() => {dragOverItem.current = idx}}
                            onDragEnd={handleSort} 
                            >
                            <Td>{idx+1}</Td>
                            <Td>{p.ref}</Td>
                            <Td>{p.designation}</Td>
                            <Td>{p.brand}</Td>
                            {p.productid != productToTest && (
                                <Td className="cursor-default" onClick={() => {removeItem(idx)}}>
                                    <CloseIcon/>
                                </Td>
                            )}
                            </Tr>
                    ))}
                    </>}             
                </Tbody>
            </Table>
        </>
    )
}