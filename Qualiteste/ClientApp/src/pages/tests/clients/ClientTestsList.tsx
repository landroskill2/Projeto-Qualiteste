import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Heading,
  Spinner,
  Box
} from "@chakra-ui/react";
import { ITestOutputModel } from "../../../common/Interfaces/Tests";
import { useNavigate, useParams } from "react-router-dom";
import { fetchClientsTests } from "../../../common/APICalls";
import TestTypeFilter from "../../../components/TestTypeFilter";
import TestsTable from "../../../components/tables/TestsTable";
import { useAuth } from "../../../auth/useAuth";


export default function ClientTestsList(): React.ReactElement{
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate()
    const client = useAuth()
    console.log(client)

  useEffect(() => {
    populateData() 
  }, []);

  const redirectToTestCreation = () => {
    navigate(`create`)
  };

  const redirectToTestPage = (id: String) => {
    navigate(`${id}`)
  }

  async function populateData() {
    
    const response = await fetchClientsTests(clientID!)
    setTests(response.data)
    setIsLoading(false)
  }
  return (
    <div  className="flex flex-col flex-grow w-full min-h-full" >
      <div className="mt-5">
        <h1 className="text-5xl font-bold text-center bg-white">Testes</h1>
      </div>
        {tests === null ? (
          <div className="flex justify-center items-center h-full flex-grow">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow">
            <TestTypeFilter type={type} setType={setType} />
            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              <TestsTable tests={tests} onClickTest={redirectToTestPage} />
            </div>
          </div>
          )}
      
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button colorScheme="blue" onClick={redirectToTestCreation}>
          Requisitar Teste
        </Button>
      </div>
    </div>
  );
}


