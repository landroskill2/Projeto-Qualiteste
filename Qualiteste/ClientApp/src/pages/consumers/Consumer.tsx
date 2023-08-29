import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Spinner } from '@chakra-ui/react';
import {IConsumerOutputModel} from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { fetchConsumerById } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGlobalToast } from '../../common/useGlobalToast';
import Page404 from '../Page404';

export default function Consumer(): React.ReactElement {
  const [pageStatus, setPageStatus] = useState<number|undefined>(undefined)
  const [consumerData, setConsumerData] = useState<IConsumerOutputModel | null>(null);
  const [sessionData, setSessionData] = useState<ISessionModel[]>([]);
  const [testData, setTestData] = useState<ITestOutputModel[]>([]);
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()
  const [isLoading, setIsLoading] = useState(true)


  const redirectToSessionPage = (id: string) => {
        navigate(`/sessions/${id}`)
  }

  const redirectToTestPage = (id: string) => {
    navigate(`/tests/${id}`)
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

  async function populateData(){
    const response = await fetchConsumerById(Number(id)).catch(err => err.response)
    setPageStatus(response.status)
    const { consumer, sessions, tests } = response.data;
    setConsumerData(consumer);
    setSessionData(sessions);
    setTestData(tests);
    }

  return (
    <>
      {isLoading &&
        <div className="flex flex-col justify-center items-center h-screen">
          <Spinner size="lg" />
        </div> || pageStatus === 404 ? (
          <Page404></Page404>
        ):(
          <div className='flex flex-col flex-grow w-full min-h-full p-6'>
          <div className="justify-center items-center">
            <div className="">
              <h1 className="text-5xl font-bold text-center bg-white">{consumerData?.fullname}</h1>
            </div>
          </div>
          <div className="flex flex-col w-full  shadow-2xl self-center rounded-xl bg-slate-100 h-full m-4 pb-7">
            <div className="flex justify-center content-center">
              <Heading size={"lg"} className="self-center ml-4">Dados do Provador</Heading>
            </div>
            <div className="flex flex-row justify-center content-center border-2 h-1/2 overflow-y-auto m-4 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
              <div className="flex flex-col w-1/5 border-r-2 border-slate-500">
                <div className="flex justify-center items-center border-b-2 p-4 border-slate-500 h-1/3 bg-slate-300">
                  <Heading size={"md"}>ID do Provador</Heading>
                </div>
                <div  className="flex h-2/3 justify-center items-center">
                  <Heading size={"md"}>{consumerData?.id}</Heading>    
                </div>
              </div>
              <div className="flex flex-col w-1/5 border-r-2 border-slate-500">
                <div  className="flex justify-center items-center border-b-2 p-4 border-slate-500 h-1/3 bg-slate-300">                    
                  <Heading size={"md"}>Idade</Heading>
                </div>
                <div  className="flex h-2/3 justify-center items-center">
                  <Heading size={"md"}>{consumerData?.age}</Heading>   
                </div>
              </div>
              <div className="flex flex-col w-1/5 border-r-2 border-slate-500">
                <div  className="flex h-1/3 items-center border-b-2 border-slate-500 p-4 bg-slate-300 justify-center">
                  <Heading size={"md"}>Contacto</Heading>
                </div>
                <div className="flex h-2/3 justify-center items-center">
                  <Heading size={"md"}>{consumerData?.contact}</Heading>
                </div>
              </div>
              <div className="flex flex-col w-1/5 border-r-2 border-slate-500">
                <div  className="flex justify-center border-b-2 border-slate-500 p-4 items-center h-1/3 bg-slate-300">                    
                  <Heading size={"md"}>Email</Heading>
                </div>
                <div  className="flex h-2/3  justify-center items-center">
                  <Heading size={"md"}>{consumerData?.email}</Heading>                    
                </div>
              </div>
              <div className="flex flex-col w-1/5">
                <div  className="flex justify-center border-b-2 border-slate-500 p-4 h-1/3 items-center bg-slate-300">                    
                  <Heading size={"md"}>Sexo</Heading>
                </div>
                <div  className="flex h-2/3  justify-center items-center">
                  <Heading size={"md"}>{consumerData?.sex}</Heading>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-row flex-grow gap-10'>
            <div className="flex flex-col flex-grow min-h-full ">
              <div className="flex flex-col flex-grow shadow-2xl self-center rounded-xl bg-slate-100 h-full w-full">
                <div className="flex flex-grow self-center justify-center items-center w-full">
                  <Heading size={"lg"} className="self-center mx-4 mt-2">Sessões do Provador</Heading>
                </div>
                <div className="flex flex-col border-2 h-full m-4 rounded-lg border-slate-500 overflow-hidden">
                  <div className="flex flex-col flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                    <Table variant="simple">
                      <Thead top={0} zIndex="docked" position={"sticky"} className="rounded-lg bg-slate-300 border-slate-500">
                        <Tr >
                          <Th>ID</Th>
                          <Th>Data</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sessionData.map((session) => (
                          <Tr className="hover:bg-slate-200 cursor-pointer h-4" key={session.id} onClick={ () => redirectToSessionPage(session.id)}>
                            <Td>{session.id}</Td>
                            <Td>{session.date}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            <div className='min-h-full w-fit justify-center bg-slate-100 rounded-lg items-center flex-grow'>
              <div className="flex flex-col w-full justify-between h-full">
                <div className="flex justify-center items-center w-full">
                  <Heading size={"lg"} className="self-center mx-4 mt-2">Testes HT</Heading>
                </div>
                <div className="flex flex-col border-2 h-full m-4 rounded-lg border-slate-500 overflow-hidden">
                  <div className="flex flex-col flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                      <Table variant="simple">
                        <Thead top={0} zIndex="docked" position={"sticky"} className="rounded-lg bg-slate-300 border-slate-500">
                          <Tr>
                            <Th>ID</Th>
                            <Th>Data do pedido</Th>
                            <Th>Data de validação</Th>
                            <Th>Data final do teste</Th>
                            <Th>Data de entrega do relatório</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {testData.map((test) => (
                            <Tr className="hover:bg-slate-200 cursor-pointer" key={test.id} onClick={ () => redirectToTestPage(test.id)}>
                              <Td>{test.id}</Td>
                              <Td>{test.requestDate || '-'}</Td>
                              <Td>{test.validationDate || '-'}</Td>
                              <Td>{test.dueDate || '-'}</Td>
                              <Td>{test.reportDeliveryDate || '-'}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>     
        </div>
        )
      }
    </>
  );
}
