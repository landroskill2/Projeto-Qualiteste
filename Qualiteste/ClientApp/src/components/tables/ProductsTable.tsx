import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from "@chakra-ui/react";
import {ProductOutputModel} from "../../common/Interfaces/Products"

type TableProps = {
    products : ProductOutputModel[],
    onClickProduct? : (id: string) => void
}

export default function ProductsTable( {products, onClickProduct} : TableProps) : React.ReactElement{
    return (
        <Table variant="simple" overflow="auto">
            <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Designação</Th>
                    <Th>Marca</Th>
                </Tr>
            </Thead>
            <Tbody>
                {products && <>
                    {products.map((p) => (
                        <Tr className="hover:bg-slate-200 cursor-pointer" key={p.productid} onClick ={() => {console.log("Redirect to product page")}} >
                            <Td>{p.productid}</Td>
                            <Td>{p.designation}</Td>
                            <Td>{p.brand}</Td>
                        </Tr>
                    ))}
                </>}             
            </Tbody>
        </Table>
    )
}