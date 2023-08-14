import { useState, useEffect } from "react";
import { Icon, CloseIcon } from "@chakra-ui/icons";

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
import { addConsumerToSession, addTestToSession, fetchSessionById, removeNotConfirmedConsumers, confirmConsumerSession, updateConsumerAttendance } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IConsumerOutputModel} from "../../common/Interfaces/Consumers";
import AddConsumersModal from "../../components/modals/AddConsumersModal";
import SessionTimeSelector from "../../components/SessionTimeSelector";
import AddTestsModal from "../../components/modals/AddTestsModal";
import { useGlobalToast } from "../../common/useGlobalToast";

type ConsumersInSession = {
  sessionTime: string,
  consumersInfo: ConsumerAttendance[]
}

type ConsumerAttendance = {
  attendance? : boolean,
  consumer : IConsumerOutputModel
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

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 100 200' {...props}>
      <path
        fill='currentColor'
        d='M 50, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  )

  const updateAttendance = async (sessionId : string, consumerId : number, attendance : boolean | undefined) => {
    if(attendance == undefined) attendance = true
    else {
      attendance = !attendance
    }
    const resp = await updateConsumerAttendance(sessionId, consumerId, attendance).catch(err => {
      console.log(err)
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
  const useCircleIcon = (attendance : boolean | undefined, onClick : () => void) => {
    let currColor = "grey"
    if(attendance != undefined){
      currColor = attendance == true ? "green.500" : "red.500"
    }

    return (
      <CircleIcon boxSize={6} onClick={onClick} color={currColor}></CircleIcon>
    )
  }

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
  const groupConsumerSessionsByTime = (): {confirmed : ConsumersInSession[], invited? : ConsumersInSession} => {
    const grouped: { [key: string]: ConsumerAttendance[] } = {};
    if (consumerSessions) {
      consumerSessions.forEach((consumerSession) => {
        if (grouped[consumerSession.sessiontime!!]) {
          grouped[consumerSession.sessiontime!!].push({attendance : consumerSession.attendance, consumer : consumerSession.consumer});
        } else {
          grouped[consumerSession.sessiontime!!] = [{attendance : consumerSession.attendance, consumer : consumerSession.consumer}];
        }
      });
    }
    // convert the grouped object to an array of objects with sessionTime and consumers properties
    const confirmed = [];
    let invited : ConsumersInSession | undefined
    for (const [sessionTime, consumersInfo] of Object.entries(grouped)) {
      if(sessionTime === "null") invited = { sessionTime : "Convidados", consumersInfo };
      else confirmed.push({ sessionTime, consumersInfo });
    }
    return {confirmed, invited};
  };
  let sortedConsumerSessions : {confirmed : ConsumersInSession[], invited? : ConsumersInSession} = groupConsumerSessionsByTime()
  let availableSessionTimes = sortedConsumerSessions.confirmed.map(cSession => cSession.sessionTime)
  console.log(sortedConsumerSessions.confirmed)
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
          
          {sortedConsumerSessions.invited!
           && (
           <>
           <Heading>Provadores Convidados</Heading>
           <Button onClick={() => {removeNotConfirmed(session!.id)}}>Limpar Convidados</Button>
           <Table variant="simple">
           <Tbody>
              <Tr>
                {sortedConsumerSessions.invited.consumersInfo.map(( cInfo ) => (
                  <Td key={sortedConsumerSessions.invited?.sessionTime}>
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center">
                          <Tr key={cInfo.consumer.id} onClick={() => redirectToConsumerPage(cInfo.consumer.id)}>
                            <Td className="hover:bg-slate-200 cursor-pointer">{cInfo.consumer.fullname}</Td>
                          </Tr>
                          <div className="flex gap-4 items-center content-between">
                            <div className="hover:bg-slate-200 cursor-pointer px-1">
                              <CloseIcon boxSize="0.7em" onClick={() => {removeNotConfirmed(session!.id, cInfo.consumer.id)}} />
                            </div>
                            
                            <div className="hover:bg-slate-200 cursor-pointer px-1">
                              <SessionTimeSelector consumerId={cInfo.consumer.id} sessionId={session!.id} availableSessionTimes={availableSessionTimes} onSubmit={confirmSessionTime}></SessionTimeSelector>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                   
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
                {sortedConsumerSessions.confirmed.map(({ consumersInfo }) => (
                  <Td key={consumersInfo[0].consumer.id}>
                    {consumersInfo.map((consumerInfo) => (
                      <div className="flex items-center">
                        <Tr key={consumerInfo.consumer.id} onClick={() => redirectToConsumerPage(consumerInfo.consumer.id)}>
                          <Td className="hover:bg-slate-200 cursor-pointer">{consumerInfo.consumer.fullname}</Td>
                        </Tr>
                        <div className="hover:bg-slate-200 cursor-pointer">
                          {useCircleIcon(consumerInfo.attendance, (() => updateAttendance(session!.id, consumerInfo.consumer.id, consumerInfo.attendance)))}
                        </div>
                        
                      </div>
                      
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
