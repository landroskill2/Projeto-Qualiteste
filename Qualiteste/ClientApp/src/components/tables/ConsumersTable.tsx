import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { IConsumerOutputModel } from "../../common/Interfaces/Consumers";

type TableProps = {
    consumers? : IConsumerOutputModel[],
    onClickConsumer : (id: number) => void
}

export default function ConsumersTable({consumers, onClickConsumer} : TableProps) : React.ReactElement {
    
    return (
        <Table variant="simple" overflow="auto">
            <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Fullname</Th>
                    <Th>Age</Th>
                    <Th>Sex</Th>
                    <Th>Contact</Th>
                </Tr>
            </Thead>
    
            <Tbody>
                {consumers && (
                        <>
                            {consumers.map((consumer) => (
                                <Tr className="hover:bg-slate-200 cursor-pointer" key={consumer.id} onClick={() => onClickConsumer(consumer.id)}>
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
    )
}