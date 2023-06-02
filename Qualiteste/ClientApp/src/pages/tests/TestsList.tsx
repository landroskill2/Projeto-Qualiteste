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

    const response = await fetchTests(filters).then(res => res.json())
    setTests(response)
    setIsLoading(false)
  }
  return (
    <div className="flex flex-col h-full" style={{ height: "calc(100vh - 115px)" }}>
      <div className="p-6 flex-grow overflow-y-hidden">
        <h1 className="text-5xl font-bold text-center">Testes</h1>
          {tests === null ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <TestTypeFilter type={type} setType={setType} />
              <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <TestsTable tests={tests} onClickTest={redirectToTestPage} />
              </div>
            </>
          )}
      </div>
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button colorScheme="blue" onClick={redirectToTestCreation}>
          Criar Teste
        </Button>
      </div>
    </div>
  );
}


