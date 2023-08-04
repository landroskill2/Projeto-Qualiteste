import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import {IConsumerOutputModel} from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { fetchConsumerById } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGlobalToast } from '../../common/useGlobalToast';

export default function Consumer(): React.ReactElement {
  const [consumerData, setConsumerData] = useState<IConsumerOutputModel | null>(null);
  const [sessionData, setSessionData] = useState<ISessionModel[]>([]);
  const [testData, setTestData] = useState<ITestOutputModel[]>([]);
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()


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

    const fetchData = async () => {
      const response = await fetchConsumerById(Number(id))
      const { consumer, sessions, tests } = response.data;

      setConsumerData(consumer);
      setSessionData(sessions);
      setTestData(tests);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col flex-grow w-full min-h-full p-6 gap-10'>
      <div className="justify-center items-center">
        <div className="mt-5">
          <h1 className="text-5xl font-bold text-center bg-white">{consumerData?.fullname}</h1>
        </div>
      </div>
      <div>
        <div className='flex-grow justify-center items-center'>
          <div className='p-10 rounded-lg shadow-lg'>
            <Box as="h2" fontSize="xl" fontWeight="bold" mb={4}>
               Dados do Provador
             </Box>
            <Table variant="simple" mb={8}>
              <Tbody>
                <Tr>
                  <Td>Idade:</Td>
                  <Td>{consumerData?.age}</Td>
                </Tr>
                <Tr>
                  <Td>Sexo:</Td>
                  <Td>{consumerData?.sex}</Td>
                </Tr>
                <Tr>
                  <Td>Contacto:</Td>
                  <Td>{consumerData?.contact}</Td>
                </Tr>
                <Tr>
                  <Td>Email:</Td>
                  <Td>{consumerData?.email || '-'}</Td>
                </Tr>
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className='flex flex-row flex-grow gap-10'>
        <div className="min-h-full w-fit flex-grow">
          <div className='min-h-full p-10 rounded-lg shadow-lg max-w-lg'>
            <Box as="h2" fontSize="xl" fontWeight="bold" mb={4}>
               Sessões do Provador
             </Box>

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Data</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sessionData.map((session) => (
                  <Tr className="hover:bg-slate-200 cursor-pointer" key={session.id} onClick={ () => redirectToSessionPage(session.id)}>
                    <Td>{session.id}</Td>
                    <Td>{session.date}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>

        <div className='min-h-full w-fit justify-center items-center flex-grow'>
          <div className='p-10 rounded-lg shadow-lg min-h-full'>
            <Box as="h2" fontSize="xl" fontWeight="bold" mb={4}>
              Testes HT
            </Box>
            <Table variant="simple">
              <Thead>
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
  );
}
