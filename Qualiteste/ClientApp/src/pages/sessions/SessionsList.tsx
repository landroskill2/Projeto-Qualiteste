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
import { ISessionModel } from "../../common/Interfaces/Sessions";
import { useNavigate } from "react-router-dom";
import { fetchSessions } from "../../common/APICalls";


export default function Sessions(): React.ReactElement{
    const [sessions, setSessions] = useState<ISessionModel[] | null>(null);
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [type]);


  function redirectToSession(id: string): void {
    navigate(`${id}`)
  }

  const redirectToSessionCreation = () => {
    navigate("create")
  };

  async function populateData() {

    const response = await fetchSessions()
    setSessions(response.data)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ height: "calc(100vh - 115px)" }}>
      <div className="p-6 flex-grow overflow-y-hidden">
        <h1 className="text-5xl font-bold text-center">Sessões</h1>
          {sessions === null ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              <Table variant="simple" overflow="auto">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Data</Th>
                    <Th>Nº de provadores</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sessions.map((session) => (
                    <Tr className="hover:bg-slate-200 cursor-pointer" key={session.id} onClick={() => redirectToSession(session.id)}>
                      <Td>{session.id}</Td>
                      <Td>{session.date}</Td>
                      <Td>{session.consumersNumber.toString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              </div>
            </>
          )}
      </div>
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button colorScheme="blue" onClick={redirectToSessionCreation}>
          Criar Sessão
        </Button>
      </div>
    </div>
  );
}


