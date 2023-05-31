import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import {IConsumerOutputModel} from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { fetchConsumerById } from '../../common/APICalls';
import { useNavigate, useParams } from 'react-router-dom';

export default function Consumer(): React.ReactElement {
  const [consumerData, setConsumerData] = useState<IConsumerOutputModel | null>(null);
  const [sessionData, setSessionData] = useState<ISessionModel[]>([]);
  const [testData, setTestData] = useState<ITestOutputModel[]>([]);
  const { id } = useParams()
  const navigate = useNavigate()


  const redirectToSessionPage = (id: string) => {
        navigate(`/sessions/${id}`)
  }

  const redirectToTestPage = (id: string) => {
    navigate(`/tests/${id}`)
}

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchConsumerById(Number(id)).then(res => res.json())
      const { consumer, sessions, tests } = response;

      setConsumerData(consumer);
      setSessionData(sessions);
      setTestData(tests);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Box as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
        {consumerData?.fullname}
      </Box>

      <Table variant="simple" mb={8}>
        <Tbody>
          <Tr>
            <Td>Age:</Td>
            <Td>{consumerData?.age}</Td>
          </Tr>
          <Tr>
            <Td>Sex:</Td>
            <Td>{consumerData?.sex}</Td>
          </Tr>
          <Tr>
            <Td>Contact:</Td>
            <Td>{consumerData?.contact}</Td>
          </Tr>
          <Tr>
            <Td>Email:</Td>
            <Td>{consumerData?.email || '-'}</Td>
          </Tr>
        </Tbody>
      </Table>

      <Box mb={8}>
        <Box as="h2" fontSize="xl" fontWeight="bold" mb={4}>
          Sessions
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Consumers Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessionData.map((session) => (
              <Tr className="hover:bg-slate-200 cursor-pointer" key={session.id} onClick={ () => redirectToSessionPage(session.id)}>
                <Td>{session.id}</Td>
                <Td>{session.date}</Td>
                <Td>{session.consumersNumber.toString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box mb={8}>
        <Box as="h2" fontSize="xl" fontWeight="bold" mb={4}>
          Home Tests
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Consumers Number</Th>
              <Th>Request Date</Th>
              <Th>Validation Date</Th>
              <Th>Due Date</Th>
              <Th>Report Delivery Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testData.map((test) => (
              <Tr className="hover:bg-slate-200 cursor-pointer" key={test.id} onClick={ () => redirectToTestPage(test.id)}>
                <Td>{test.id}</Td>
                <Td>{test.consumersNumber.toString()}</Td>
                <Td>{test.requestDate || '-'}</Td>
                <Td>{test.validationDate || '-'}</Td>
                <Td>{test.dueDate || '-'}</Td>
                <Td>{test.reportDeliveryDate || '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
