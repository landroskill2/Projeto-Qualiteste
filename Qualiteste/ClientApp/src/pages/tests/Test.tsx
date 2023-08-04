import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button, Input } from "@chakra-ui/react";
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { addConsumerToTest, fetchTestById, uploadFile } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import AddConsumersModal from "../../components/modals/AddConsumersModal";
import { useGlobalToast } from "../../common/useGlobalToast";

export default function Test(): React.ReactElement {
  const [session, setSession] = useState<ISessionModel | null>(null);
  const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
  const [test, setTest] = useState<ITestOutputModel | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()

  const redirectToSessionPage = (id: string) => {
    navigate(`/sessions/${id}`);
  };

  const redirectToConsumerPage = (id: number) => {
    navigate(`/consumers/${id}`);
  };

  const addConsumers = async (consumers : number[]) => {
    const resp = await addConsumerToTest(id!, consumers).catch(err => {
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

  async function populateData(){
    try {
      const response = await fetchTestById(id!!)
      const data = response.data

      setSession(data.session);
      setConsumers(data.consumers);
      setTest(data.test);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) {
      const resp = await uploadFile(id!, file)
      console.log(resp)
      if(resp.status === 201) {
        const toastObj = {id: "success", title: "Sucesso", description: "Ficheiro processado com sucesso.", status: "success"}
        const location = resp!.headers.location.split("/api")[1]
        navigate(location, {state: toastObj})
      }
    }
  };

  const isHomeTest = test?.type === "HT";

  if (isLoading) {
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
    <div className='flex flex-col flex-grow w-full min-h-full p-6'>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box as="h1" fontSize="2xl" fontWeight="bold">
            TestID = {test?.id} 
          </Box>

          {isHomeTest && 
            <Box>
              <AddConsumersModal onSubmit={addConsumers}/>
            </Box>
          }
          {!isHomeTest &&
          <>
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
          </>
          }


        </Box>
        <Box className="hover:cursor-pointer" as="h1" fontSize="2xl" fontWeight="bold" mb={4} onClick={() => redirectToSessionPage(session!.id)}>
          {session?.id}
        </Box>
        <Box as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
          Number of Consumers: {test?.consumersNumber.toString()}
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
    </div>
  );
}
