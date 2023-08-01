import { useState, useEffect } from "react";
import {
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { IConsumerOutputModel } from "../../common/Interfaces/Consumers";

type TableProps = {
    consumers? : IConsumerOutputModel[],
    onClickConsumer : (id: number) => void,
    selectedConsumers? : number[] 
}

export default function ConsumersTable({consumers, onClickConsumer, selectedConsumers} : TableProps) : React.ReactElement {
    function CheckBox(id : number) : React.ReactElement { 
        return (
        <Td>
            <Checkbox isChecked={selectedConsumers!.includes(id)}></Checkbox>
        </Td>
        )
        
    }
    useEffect(() => {
        
        console.log(selectedConsumers)
     }, [selectedConsumers]);

    return (
        <TableContainer overflowX="unset" overflowY="unset">
        <Table variant="simple" size="md" overflow="auto" colorScheme="blackAlpha">
            <Thead top={0} zIndex="docked">
                <Tr>
                    {selectedConsumers && <Th></Th>}
                    <Th>Id</Th>
                    <Th>Nome</Th>
                    <Th>Idade</Th>
                    <Th>Sexo</Th>
                    <Th>Contacto</Th>
                </Tr>
            </Thead>
    
            <Tbody>
                {consumers && (
                        <>
                            {consumers.map((consumer) => (
                                <Tr className="hover:bg-slate-200 cursor-pointer" key={consumer.id} onClick={() => onClickConsumer(consumer.id)}>
                                    {selectedConsumers && (
                                       CheckBox(consumer.id)
                                    )}
                                    <Td>{consumer.id}</Td>
                                    <Td>{consumer.fullname}</Td>
                                    <Td>{consumer.age}</Td>
                                    <Td>{consumer.sex}</Td>
                                    <Td>{consumer.contact}</Td>
                                </Tr>
                            ))}
                        </>
                )}    
                {!consumers && (
                    <>
                        <p>Sem Dados.</p>
                    </>
                )}   
            </Tbody>
        </Table>
        </TableContainer>
    )
}