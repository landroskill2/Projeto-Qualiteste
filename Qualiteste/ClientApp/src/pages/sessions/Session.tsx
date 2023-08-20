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
  Tfoot,
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
import { CircleIconDiv } from "../../components/CIrcleIconDiv";

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
      <div className="flex hover:bg-slate-300 cursor-pointer justify-center items-center content-center" onClick={onClick} onMouseOver={() => {currColor = nextColorState(attendance)}}>
        <CircleIcon boxSize={4} className="self-center" color={currColor}></CircleIcon>
      </div>
    )
  }

  function nextColorState(attendance : boolean | undefined) : string {
    console.log(attendance)
    switch(attendance){
      case true:
        return 'red.500'
      case false:
        return 'green.500'
      default : 
        return 'green.500'
    }
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
        <div className="flex flex-col justify-center items-center h-screen">
          <Spinner size="lg" />
        </div> || 
        <div className="flex flex-col w-full h-[calc(100vh-72px)] overflow-y-hidden">
          <div className="flex justify-between content-center m-4 flex-grow h-1/6">
            <div className="flex flex-col flex-grow shadow-2xl self-center rounded-xl bg-slate-100 h-full m-4 mt-10 pb-7">
              <div className="flex justify-center content-center">
                <Heading size={"lg"} className="self-center ml-4">Dados da Sessão</Heading>
              </div>
              <div className=" border-2 h-1/2 overflow-y-auto m-4 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">

              </div>
            </div>
            {/* <Box as="h1" fontSize="2xl" fontWeight="bold">
              <Heading>{session!.id}</Heading>
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
           

            <Box>
              
            </Box>

            <Box>
              
            </Box> */}
          </div>
          <div className="flex flex-row flex-grow w-full h-3/5">
            <div className="flex flex-col content-center justify-center h-full flex-grow">
              <div className="flex flex-col flex-grow shadow-2xl m-5 self-center rounded-xl bg-slate-100 h-2/3">
                <div className="flex justify-between">
                  <Heading size={"md"} className="self-center ml-4">Testes da Sessão</Heading>
                  <AddTestsModal onClickTest={addTest}/>
                </div>
                <div className=" border-2 h-1/2 overflow-y-auto m-4 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                  <Table variant={"simple"}>
                    <Thead>
                      <Tr className=" bg-slate-200">
                        <Th>ID</Th>
                        <Th>Tipo de teste</Th>
                        <Th>Número de provadores</Th>
                        <Th>Data de pedido</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tests.map((test) => (
                        <Tr className="hover:bg-slate-300 cursor-pointer h-4" key={test.id} onClick={() => redirectToTestPage(test.id)}>
                          <Td>{test.id}</Td>
                          <Td>{test.type}</Td>
                          <Td>{test.consumersNumber.toString()}</Td>
                          <Td>{test.requestDate ?? "-"}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>                 
              </div>              
            </div>
            <div className="flex flex-col w-2/3 mx-10 flex-grow justify-center content-center">
              <div className="flex flex-row flex-grow shadow-2xl w-full m-5 self-center rounded-xl bg-slate-100 h-2/3 gap-4 justify-between">              
                <div className="flex flex-col w-2/5 justify-between">
                  <div className="flex justify-between content-center overflow-hidden">
                    <Heading size={"md"} className="self-center mx-4 mt-2">Provadores Convidados</Heading>
                    <AddConsumersModal onSubmit={addConsumers}/>
                  </div>
                  <div className="flex flex-col border-2 h-full m-4 rounded-lg border-slate-500 overflow-hidden">
                    <div className="flex flex-col flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                      <div className="flex flex-grow">
                        <Table variant="simple" size="sm">
                          <Tbody>
                            {sortedConsumerSessions.invited?.consumersInfo.map(( cInfo ) => (
                              <Tr className="flex flex-grow w-full flex-row" key={sortedConsumerSessions.invited?.sessionTime}>
                                <Td className="hover:bg-slate-300 cursor-pointer flex flex-grow" onClick={() => redirectToConsumerPage(cInfo.consumer.id)}>{cInfo.consumer.fullname}</Td>
                                <Td className=" hover:bg-red-400 cursor-pointer flex justify-center content-center"><CloseIcon className="self-center" boxSize="0.7em" onClick={() => {removeNotConfirmed(session!.id, cInfo.consumer.id)}} /></Td>
                                <Td className="hover:bg-green-300 cursor-pointer flex justify-center content-center"><SessionTimeSelector consumerId={cInfo.consumer.id} sessionId={session!.id} availableSessionTimes={availableSessionTimes} onSubmit={confirmSessionTime}></SessionTimeSelector></Td>
                              </Tr>
                            ))}                     
                          </Tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="flex w-full bg-slate-300 self-baseline hover:bg-slate-200">
                      <Button bgColor={"gray.300"} className="flex grow w-full rounded-b-lg rounded-t-none" onClick={() => {removeNotConfirmed(session!.id)}}>Limpar Convidados</Button>
                    </div>
                  </div>
                </div>              
                <div className="flex flex-col w-3/5">
                  <Heading size={"md"} className="justify-center self-center">Provadores Confirmados</Heading>
                  <div className=" flex overflow-x-auto flex-shrink border-2 h-full m-4 rounded-lg border-slate-500 overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                    {sortedConsumerSessions.confirmed.map(({ sessionTime, consumersInfo }) => (
                      sessionTime && (
                        <div className="flex-shrink-0 overflow-y-auto overflow-x-hidden flex-grow min-w-1/3 border-r border-slate-500 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                          <Table variant="simple" size={"sm"}>
                            <Thead top={0} zIndex="docked" position={"sticky"} className="rounded-lg bg-slate-300 ">
                              <Tr className=" bg-slate-200">
                                <Th>
                                  {sessionTime}
                                </Th> 
                              </Tr>
                            </Thead>
                            <Tbody>
                              {consumersInfo.map((consumer => (
                                  <Tr key={consumer.consumer.id}>
                                    <div className="flex flex-grow w-full"> 
                                      <CircleIconDiv attendance={consumer.attendance} onClick={() => updateAttendance(session!.id, consumer.consumer.id, consumer.attendance)}></CircleIconDiv>                                                               
                                      <Td className="flex flex-row flex-grow hover:bg-slate-300 cursor-pointer" onClick={() => redirectToConsumerPage(consumer.consumer.id)}>                                    
                                        {consumer.consumer.fullname}
                                      </Td>
                                    </div>
                                    
                                  </Tr>           
                                )
                              ))}
                            </Tbody>
                          </Table>
                        </div>
                      )
                    ))}    
                  </div>                  
                </div>
              </div>  
            </div>
          </div>
        </div>
      }
    </>
  );
}
