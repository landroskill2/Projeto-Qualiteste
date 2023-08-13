import { useState, useEffect } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

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
import { IConsumerSessionOutputModel } from '../../common/Interfaces/Sessions'
import { ITestOutputModel } from "../../common/Interfaces/Tests";
import { addConsumerToSession, addTestToSession, fetchSessionById, removeNotConfirmedConsumers, confirmConsumerSession } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IConsumerOutputModel} from "../../common/Interfaces/Consumers";
import AddConsumersModal from "../../components/modals/AddConsumersModal";
import SessionTimeSelector from "../../components/SessionTimeSelector";
import AddTestsModal from "../../components/modals/AddTestsModal";
import { useGlobalToast } from "../../common/useGlobalToast";

type ConsumersInSession = {
  sessionTime: string,
  consumers: IConsumerOutputModel[]
}

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

  const removeNotConfirmed = async (sessionId : string, selection? : string | number) => {
    const resp = await removeNotConfirmedConsumers(sessionId, selection).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })
    console.log(resp)
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: resp.data.message, status: "success"})
      })
    } 
  }

  async function confirmSessionTime (sessionId : string, consumerId : number, sessionTime : string){
    const resp = await confirmConsumerSession(sessionId, consumerId, sessionTime).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: resp.data.message, status: "success"})
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
        addToast({id: "success", title: "Sucesso", description: resp.data.message, status: "success"})
      })
    }
  }

  const addConsumers = async (consumersID : number[]) => {
    const resp = await addConsumerToSession(id!, consumersID).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    }) 
    console.log(resp)
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: resp.data.message, status: "success"})
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
  const groupConsumerSessionsByTime = (): {confirmed : ConsumersInSession[], invited : ConsumersInSession[]} => {
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
    const confirmed = [];
    const invited = []
    for (const [sessionTime, consumers] of Object.entries(grouped)) {
      if(sessionTime === "null") invited.push({ sessionTime : "Convidados", consumers });
      else confirmed.push({ sessionTime, consumers });
    }

    return {confirmed, invited};
  };
  let sortedConsumerSessions : {confirmed : ConsumersInSession[], invited : ConsumersInSession[]} = groupConsumerSessionsByTime()
  let availableSessionTimes = sortedConsumerSessions.confirmed.map(cSession => cSession.sessionTime)
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
          
          {sortedConsumerSessions.invited.length>0
           && (
           <>
           <Heading>Provadores Convidados</Heading>
           <Button onClick={() => {removeNotConfirmed(session!.id)}}>Limpar Convidados</Button>
           <Table variant="simple">
           <Tbody>
              <Tr>
                {sortedConsumerSessions.invited.map(({ consumers }) => (
                  <Td key={consumers[0].id}>
                    {consumers.map((consumer) => (
                      <div className="flex items-center justify-center">
                        <Tr key={consumer.id} onClick={() => redirectToConsumerPage(consumer.id)}>
                          <Td className="hover:bg-slate-200 cursor-pointer">{consumer.fullname}</Td>
                        </Tr>
                        <div className="flex gap-4 items-center content-between">
                          <div className="hover:bg-slate-200 cursor-pointer px-1">
                            <CloseIcon boxSize="0.7em" onClick={() => {removeNotConfirmed(session!.id, consumer.id)}} />
                          </div>
                          
                          <div className="hover:bg-slate-200 cursor-pointer px-1">
                            <SessionTimeSelector consumerId={consumer.id} sessionId={session!.id} availableSessionTimes={availableSessionTimes} onSubmit={confirmSessionTime}></SessionTimeSelector>
                          </div>
                        </div>
                      </div>
                      
                    ))}
                  </Td>
                ))}
              </Tr>
            </Tbody>
           </Table>
           </>
           )}
          <Heading>Provadores Confirmados</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                {sortedConsumerSessions.confirmed.map(({ sessionTime }) => (
                  sessionTime && <Th key={sessionTime}>{sessionTime}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {sortedConsumerSessions.confirmed.map(({ consumers }) => (
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
