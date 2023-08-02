import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ISessionModel } from '../../common/Interfaces/Sessions'
import { IConsumerSessionOutputModel, IConsumerSessionInputModel } from '../../common/Interfaces/Sessions'
import { ITestOutputModel } from "../../common/Interfaces/Tests";
import { addConsumerToSession, addTestToSession, fetchSessionById, removeNotConfirmedConsumers } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IConsumerOutputModel} from "../../common/Interfaces/Consumers";
import AddConsumersModal from "../../components/modals/AddConsumersModal";
import AddTestsModal from "../../components/modals/AddTestsModal";
import { useGlobalToast } from "../../common/useGlobalToast";

export default function Session() : React.ReactElement{
  // State variables to hold the session, consumerSessions, and tests data
  const [session, setSession] = useState<ISessionModel | null>(null);
  const [consumerSessions, setConsumerSessions] = useState<IConsumerSessionOutputModel[]>([]);
  const [tests, setTests] = useState<ITestOutputModel[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const {id} = useParams()
  const navigate = useNavigate()
  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()

  const redirectToConsumerPage = (id: number) => {
    navigate(`/consumers/${id}`)
  }

  const redirectToTestPage = (id: string) => {
    navigate(`/tests/${id}`)
  }

  const removeNotConfirmed = async (sessionId : string, selection? : string) => {
    const resp = await removeNotConfirmedConsumers(sessionId, selection).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })

    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: resp.data, status: "success"})
      })
    } 
  }

  const addTest = async (testID : string) => {
    const resp = await addTestToSession(id!, testID).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: "Teste adicionado com sucesso.", status: "success"})
      })
    }
  }

  const addConsumers = async (consumersID : number[]) => {
    let body = consumersID.map(n => { return {consumerId : n} as IConsumerSessionInputModel} )
    const resp = await addConsumerToSession(id!, body).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    }) 
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: "Provador adicionado com sucesso.", status: "success"})
      })   
    }
    
  }

  useEffect(() => {
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }

    populateData().then(() => {
      setIsLoading(false)
    });

  }, []);

  async function populateData() {
    const response = await fetchSessionById(id!!)
    const { session, consumers, tests } = response.data;

    setSession(session);
    setConsumerSessions(consumers);
    setTests(tests);
  }

  // Helper function to group the consumerSessions by sessionTime
  const groupConsumerSessionsByTime = (): { sessionTime: string, consumers: IConsumerOutputModel[] }[] => {
    const grouped: { [key: string]: IConsumerOutputModel[] } = {};
    if (consumerSessions) {
      consumerSessions.forEach((consumerSession) => {
        if (grouped[consumerSession.sessiontime!!]) {
          grouped[consumerSession.sessiontime!!].push(consumerSession.consumer);
        } else {
          grouped[consumerSession.sessiontime!!] = [consumerSession.consumer];
        }
      });
    }

    // convert the grouped object to an array of objects with sessionTime and consumers properties
    const result = [];
    for (const [sessionTime, consumers] of Object.entries(grouped)) {
      result.push({ sessionTime, consumers });
    }

    return result;
  };

  // Render the component
  return (
    <>
      {isLoading && 
        <div className="flex flex-col justify-center items-center h-full">
          <Spinner size="lg" />
        </div> || 
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Box as="h1" fontSize="2xl" fontWeight="bold">
              <Heading>{session!.id}</Heading>
            </Box>

            <Box>
              <AddTestsModal onClickTest={addTest}/>
            </Box>

            <Box>
              <AddConsumersModal onSubmit={addConsumers}/>
            </Box>
          </Box>
          
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Number of Consumers</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{session!.date}</Td>
                <Td>{session!.consumersNumber.toString()}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Heading>Consumer Sessions</Heading>
          /**Temporario, mudar aspecto e interação com o butão*/
          {groupConsumerSessionsByTime().filter(cs => {cs.sessionTime == undefined})
           && <Button onClick={() => {removeNotConfirmed(session!.id)}}>Limpar Não Confirmados</Button>}
          <Table variant="simple">
            <Thead>
              <Tr>
                {groupConsumerSessionsByTime().map(({ sessionTime }) => (
                  sessionTime && <Th key={sessionTime}>{sessionTime}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {groupConsumerSessionsByTime().map(({ consumers }) => (
                  <Td key={consumers[0].id}>
                    {consumers.map((consumer) => (
                      <Tr key={consumer.id} onClick={() => redirectToConsumerPage(consumer.id)}>
                        <Td className="hover:bg-slate-200 cursor-pointer">{consumer.fullname}</Td>
                      </Tr>
                    ))}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
          <Heading>Tests</Heading>
            <Table>
              <Thead>
                <Tr>
                  <Th>Test ID</Th>
                  <Th>Type</Th>
                  <Th>Number of Consumers</Th>
                  <Th>Request Date</Th>
                </Tr>
              </Thead>
            <Tbody>
              {tests.map((test) => (
                <Tr className="hover:bg-slate-200 cursor-pointer" key={test.id} onClick={() => redirectToTestPage(test.id)}>
                  <Td>{test.id}</Td>
                  <Td>{test.type}</Td>
                  <Td>{test.consumersNumber.toString()}</Td>
                  <Td>{test.requestDate ?? "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      }
    </>
  );
}
