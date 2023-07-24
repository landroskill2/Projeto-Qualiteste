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
import { ITestOutputModel } from "../../common/Interfaces/Tests";
import { useNavigate } from "react-router-dom";
import { fetchTests } from "../../common/APICalls";
import TestTypeFilter from "../../components/TestTypeFilter";
import TestsTable from "../../components/tables/TestsTable";


export default function Tests(): React.ReactElement{
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [type]);

  const redirectToTestCreation = () => {
    navigate(`create`)
  };

  const redirectToTestPage = (id: String) => {
    navigate(`${id}`)
  }

  async function populateData() {
    const filters = Object.assign(
      {},
      type === null ? null : {type: type},
    )

    const response = await fetchTests(filters)
    setTests(response.data)
    setIsLoading(false)
  }
  return (
    <div  className="flex flex-col flex-grow w-full min-h-full" >
      <div>
        <h1 className="text-5xl font-bold text-center bg-white">Testes</h1>
      </div>
        {tests === null ? (
          <div className="flex justify-center items-center h-full flex-grow">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mt-10 px-6 min-h-full w-full flex flex-col flex-grow">
            <TestTypeFilter type={type} setType={setType} />
            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              <TestsTable tests={tests} onClickTest={redirectToTestPage} />
            </div>
          </div>
          )}
      
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button colorScheme="blue" onClick={redirectToTestCreation}>
          Criar Teste
        </Button>
      </div>
    </div>
  );
}


