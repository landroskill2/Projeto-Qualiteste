import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Heading,
  Spinner,
  Box
} from "@chakra-ui/react";
import IAccountOutput from "../../common/Interfaces/Accounts";
import { fetchAccounts } from "../../common/APICalls";

export default function Accounts(){
    const [accounts, setAccounts] = useState<IAccountOutput[]>([])

    useEffect(()=> {
        populateData() 
    },[])

    async function populateData() {

        const response = await fetchAccounts()
        setAccounts(response.data)
      }

    return (
        <div className="flex flex-col flex-grow h-full w-full">
          <div className="mt-5">
            <h1 className="text-5xl font-bold text-center bg-white">Contas</h1>
          </div>
          {accounts.length === 0 ? (
            <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className=" border-2 h-1/2 overflow-y-auto m-4 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
              <Table variant="simple" overflow="auto">
                <Thead top={0} zIndex="docked" position={"sticky"} className="bg-slate-300 rounded-lg">
                  <Tr>
                    <Th>Username</Th>
                    <Th>Tipo</Th>
                    <Th>Cliente</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {accounts.map((account) => (
                    <Tr key={account.username}>
                      <Td>{account.username}</Td>
                      <Td>{account.role}</Td>
                      <Td>{account.designation ? account.designation : "-"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      );
    }
    