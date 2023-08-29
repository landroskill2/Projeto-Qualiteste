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
import { fetchClientsTests, fetchTests } from "../../common/APICalls";
import TestTypeFilter from "../../components/TestTypeFilter";
import TestsTable from "../../components/tables/TestsTable";
import { useAuth } from "../../auth/useAuth";
import WithPermission from "../../auth/WithPermission";


export default function Tests(): React.ReactElement{
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const [type, setType] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user = useAuth()
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

    let response
    if(user?.role === 'CLIENT'){
      response = await fetchClientsTests()
    }else {
      response = await fetchTests(filters)
    }
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
          tests.length > 0 ? (
            <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow">
            <WithPermission allowedRoles={["ADMIN"]}>
              <TestTypeFilter type={type} setType={setType} />
            </WithPermission>
            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              <TestsTable tests={tests} onClickTest={redirectToTestPage} />
            </div>
          </div>
          ) : (
             //Add stuff here in case there is no data to show
            <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow items-center justify-center">
            <Heading>This is empty...*Temporary*</Heading>
              <img src="https://gifdb.com/images/high/tumbleweed-hills-u6pgl9vwk7x1wfor.gif"></img>
          </div>
          )
          )}
      
      <WithPermission allowedRoles={["ADMIN"]}>
        <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
          <Button colorScheme="blue" onClick={redirectToTestCreation}>
            Criar Teste
          </Button>
        </div>
      </WithPermission>
    </div>
  );
}


