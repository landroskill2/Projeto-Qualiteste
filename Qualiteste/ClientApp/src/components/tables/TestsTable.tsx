import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { ITestOutputModel } from "../../common/Interfaces/Tests";

type TableProps = {
    tests? : ITestOutputModel[],
    onClickTest : (id: string) => void
}

export default function TestsTable({tests, onClickTest} : TableProps) : React.ReactElement {
    
    return (
        <Table variant="simple" overflow="auto">
            <Thead top={0} zIndex="1" position={"sticky"} className="bg-slate-300 rounded-lg">
                <Tr>
                    <Th>Id</Th>
                    <Th>Tipo</Th>
                    <Th>Num. de provadores</Th>
                    <Th>Data da prova</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tests && <>
                    {tests.map((test) => (
                        <Tr className="hover:bg-slate-200 cursor-pointer" key={test.id} onClick ={() => onClickTest(test.id)} >
                            <Td>{test.id}</Td>
                            <Td>{test.type}</Td>
                            <Td>{test.consumersNumber.toString()}</Td>
                            <Td>{test.requestDate}</Td>
                        </Tr>
                    ))}
                </>}             
            </Tbody>
        </Table>
    )
}