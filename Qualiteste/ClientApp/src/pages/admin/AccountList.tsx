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
import { CloseIcon } from "@chakra-ui/icons";

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
        <div className="flex flex-col flex-grow h-[calc(100vh-72px)] w-full">
          <div className="mt-5">
            <h1 className="text-5xl font-bold text-center bg-white">Contas</h1>
          </div>
          {accounts.length === 0 ? (
            <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className=" border-2 h-1/2 overflow-y-auto m-10 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg">
              <Table variant="simple" overflow="auto">
                <Thead top={0} zIndex="docked" position={"sticky"} className="bg-slate-300 rounded-lg">
                  <Tr>
                    <Th>Username</Th>
                    <Th>Tipo</Th>
                    <Th>Cliente</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {accounts.map((account) => (
                    <Tr key={account.username}>
                      <Td>{account.username}</Td>
                      <Td>{account.role}</Td>
                      <Td>{account.designation ? account.designation : "-"}</Td>
                      <Td textAlign={"center"} className="hover:bg-red-400 cursor-pointer">
                        <CloseIcon className="self-center" boxSize="0.7em" onClick={() => {removeNotConfirmed(session!.id, consumer.consumer.id)}} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      );
    }
    