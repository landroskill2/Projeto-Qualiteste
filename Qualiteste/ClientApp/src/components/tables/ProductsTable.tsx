import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from "@chakra-ui/react";
import {ProductOutputModel} from "../../common/Interfaces/Products"
import { CloseIcon } from "@chakra-ui/icons";

type TableProps = {
    products : ProductOutputModel[],
    onClickProduct? : (product : ProductOutputModel) => void
    removeProduct? : (id : Number) => void
}


export default function ProductsTable( {products, onClickProduct, removeProduct} : TableProps) : React.ReactElement{
    const handleClick = (product : ProductOutputModel) => {
        if(onClickProduct) {
            onClickProduct(product)
        }
    }
    
    return (
        <Table variant="simple" overflow="auto">
            <Thead top={0} zIndex="1" position={"sticky"} className="bg-slate-300 rounded-lg">
                <Tr>
                    <Th>Referência</Th>
                    <Th>Designação</Th>
                    <Th>Marca</Th>
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {products && <>
                    {products.map((p) => (
                        <Tr className="hover:bg-slate-200 cursor-pointer" key={p.productid} onClick={() => {handleClick(p)}} >
                            <Td>{p.ref}</Td>
                            <Td>{p.designation}</Td>
                            <Td>{p.brand}</Td>
                            {removeProduct && 
                                <Td textAlign={"center"} className="hover:bg-red-400 cursor-pointer" onClick={() => {removeProduct(p.productid)}}>
                                    <CloseIcon className="self-center" boxSize="0.7em"  />
                                </Td>
                            }
                        </Tr>
                    ))}
                </>}             
            </Tbody>
        </Table>
    )
}