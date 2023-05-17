import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { ISessionOutputModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { fetchTestById } from '../../common/APICalls';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";


export default function Test(): React.ReactElement {
  const [session, setSession] = useState<ISessionOutputModel | null>(null);
  const [consumers, setConsumers] = useState<IConsumerOutputModel[]>([]);
  const [test, setTest] = useState<ITestOutputModel | null>(null);
  const { id } = useParams();
  const navigate = useNavigate()

  const redirectToSessionPage = (id: string) => {
    navigate(`/sessions/${id}`)
}

  const redirectToConsumerPage = (id: number) => {
    navigate(`/consumers/${id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTestById(id!!).then(res => res.json());

        setSession(response.session);
        setConsumers(response.consumers);
        setTest(response.test);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!test) {
    // Render a loading spinner while waiting for the API response
    return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Spinner size="xl" />
        </Box>
      )
  }

  return (
    //TODO : Change display of test id, session id and number of consumers
    <Box>
      <Box as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
        TestID = {test.id} 
      </Box>
      <Box className="hover:cursor-pointer" as="h1" fontSize="2xl" fontWeight="bold" mb={4} onClick={() => redirectToSessionPage(session.id)}>
        {session?.id}
      </Box>
      <Box as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
        Number of Consumers: {test.consumersNumber.toString()}
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Full Name</Th>
            <Th>Age</Th>
            <Th>Sex</Th>
            <Th>Contact</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {consumers.map(consumer => (
            <Tr className="hover:bg-slate-200 cursor-pointer" key={consumer.id} onClick={() => redirectToConsumerPage(consumer.id)}>
              <Td>{consumer.id}</Td>
              <Td>{consumer.fullname}</Td>
              <Td>{consumer.age}</Td>
              <Td>{consumer.sex}</Td>
              <Td>{consumer.contact}</Td>
              <Td>{consumer.email || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
