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
  Box,
  TableCaption
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
    <div className="flex flex-col flex-grow h-full w-full">
      <div className="mt-5">
        <h1 className="text-5xl font-bold text-center bg-white">Sessões</h1>
      </div>
      {sessions === null ? (
        <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
      
        <div className=" border-2 h-1/2 overflow-y-auto m-6 rounded-lg border-slate-500 bg-slate-100 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg">
          <Table variant="simple" overflow="auto">
            <Thead top={0} zIndex="docked" position={"sticky"} className="bg-slate-300 rounded-lg">
              <Tr>
                <Th>Id</Th>
                <Th>Data</Th>
                <Th>Num. de provadores</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <Tr className="hover:bg-slate-200 cursor-pointer" key={session.id} onClick={() => redirectToSession(session.id)}>
                      <Td>{session.id}</Td>
                      <Td>{session.date}</Td>
                      <Td>{session.consumersNumber.toString()}</Td>
                    </Tr>
                  ))
                ) : (
                  //Do something here
                  <Heading>This is empty...*Temporary*</Heading>
               
              )
            }
            </Tbody>
          </Table>
        </div>
        )}
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button bgColor={"gray.300"} onClick={redirectToSessionCreation}>
          Criar Sessão
        </Button>
      </div>
    </div>
  );
}


