import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button, Input } from "@chakra-ui/react";
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { addConsumerToTest, fetchTestById, uploadFile } from '../../common/APICalls';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import AddConsumersModal from "../../components/modals/AddConsumersModal";

export default function Test(): React.ReactElement {
  const [session, setSession] = useState<ISessionModel | null>(null);
  const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
  const [test, setTest] = useState<ITestOutputModel | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const redirectToSessionPage = (id: string) => {
    navigate(`/sessions/${id}`);
  };

  const redirectToConsumerPage = (id: number) => {
    navigate(`/consumers/${id}`);
  };

  const addConsumer = (consumerID : number) => {
    addConsumerToTest(id!, consumerID) // TODO: add action on response
    window.location.reload()
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) uploadFile(id!, file)
    
  };

  const isHomeTest = test?.type === "HT";

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
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box as="h1" fontSize="2xl" fontWeight="bold">
          TestID = {test.id} 
        </Box>

        {isHomeTest && 
          <Box>
            <AddConsumersModal onClickConsumer={addConsumer}/>
          </Box>
        }

        <Box>
          <Button onClick={() => navigate("fizz")}>Fizz Results</Button>
        </Box>
        
        <Box>
          <Input type="file" accept=".txt,.csv" onChange={handleFileUpload} display="none" id="file-upload" />
          <label htmlFor="file-upload">
            <Button as="span" colorScheme="blue" mr={2}>
              Upload File
            </Button>
          </label>
        </Box>
      </Box>
      <Box className="hover:cursor-pointer" as="h1" fontSize="2xl" fontWeight="bold" mb={4} onClick={() => redirectToSessionPage(session!.id)}>
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
          
          {consumers && (
            <>
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
            </>
          )}
          {!consumers && (
            <>
              <p>Sem dados.</p>
            </>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
