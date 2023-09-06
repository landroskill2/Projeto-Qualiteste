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
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSessions } from "../../common/APICalls";
import WithPermission from "../../auth/WithPermission";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGlobalToast } from "../../common/useGlobalToast";


export default function Sessions(): React.ReactElement{
    const [sessions, setSessions] = useState<ISessionModel[] | null>(null);
    const [shownSessions, setShownSessions] = useState<ISessionModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentIdx, setCurrentIdx] = useState(20)
    const [type, setType] = useState<string | null>(null)
    const {state} = useLocation()
    const {addToast, isToastActive} = useGlobalToast()
    const navigate = useNavigate()

  useEffect(() => {
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }

    populateData() 
  }, [type]);

  useEffect(() => {
    if(sessions != null){
      setShownSessions(sessions!.slice(0, currentIdx))
    }
    
  },[sessions])

  function updateShownConsumers()
  {
    let nextIdx = currentIdx + 20 > sessions!.length ? sessions!.length : currentIdx + 20
    const sessionsToAdd = sessions!.slice(currentIdx, nextIdx)
    setShownSessions((prevItems) => [...prevItems, ...sessionsToAdd] )
    setCurrentIdx(nextIdx)
  }

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
    <div className="flex flex-col flex-grow h-[calc(100vh-72px)] w-full">
      <div className="mt-5">
        <h1 className="text-5xl font-bold text-center bg-white">Sessões</h1>
      </div>
      {sessions === null ? (
        <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
      
        <div className=" border-2 h-1/2 overflow-y-auto m-6 rounded-lg border-slate-500 bg-slate-100 flex-grow" style={{ maxHeight: 'calc(100vh - 275px)', overflowY: 'auto' }}>
          <InfiniteScroll
            dataLength={shownSessions.length}
            next={updateShownConsumers}
            hasMore={shownSessions.length != sessions.length}
            loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
            endMessage={<></>}
            height={"calc(100vh - 280px)"}
            className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
          >
            <Table variant="simple" overflow="auto">
              <Thead top={0} zIndex="docked" position={"sticky"} className="bg-slate-300 rounded-lg">
                <Tr>
                  <Th>Id</Th>
                  <Th>Data</Th>
                  <Th>Num. de provadores</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                    shownSessions.map((session) => (
                      <Tr className="hover:bg-slate-200 cursor-pointer" key={session.id} onClick={() => redirectToSession(session.id)}>
                        <Td>{session.id}</Td>
                        <Td>{session.date}</Td>
                        <Td>{session.consumersNumber.toString()}</Td>
                      </Tr>
                    ))               
              }
              </Tbody>
            </Table>
          </InfiniteScroll>
          
        </div>
        )}
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <WithPermission allowedRoles={["ADMIN"]}>
          <Button bgColor={"gray.300"} onClick={redirectToSessionCreation}>
            Criar Sessão
          </Button>
        </WithPermission>
      </div>
    </div>
  );
}


