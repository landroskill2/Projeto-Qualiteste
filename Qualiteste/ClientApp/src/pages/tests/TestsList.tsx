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
import InfiniteScroll from "react-infinite-scroll-component";


export default function Tests(): React.ReactElement{
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const [shownTests, setShownTests] = useState<ITestOutputModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [type, setType] = useState<string | null>(null)
    const [currentIdx, setCurrentIdx] = useState(20)
    const user = useAuth()
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [type]);

  useEffect(() => {
    if(tests != null){
      setShownTests(tests!.slice(0, currentIdx))
    }
  },[tests])

  function updateShownTests()
  {
    let nextIdx = currentIdx + 20 > tests!.length ? tests!.length : currentIdx + 20
    const testsToAdd = tests!.slice(currentIdx, nextIdx)
    setShownTests((prevItems) => [...prevItems, ...testsToAdd] )
    setCurrentIdx(nextIdx)
  }

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
            <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow">
              <WithPermission allowedRoles={["ADMIN"]}>
                <TestTypeFilter type={type} setType={setType} />
              </WithPermission>
            <div className=" border-2 h-1/2 overflow-y-auto mt-2 rounded-lg border-slate-500 bg-slate-100 flex-grow" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
              <InfiniteScroll
              dataLength={shownTests.length}
              next={updateShownTests}
              hasMore={shownTests.length != tests.length}
              loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
              endMessage={<></>}
              height={"calc(100vh - 375px)"}
              className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
              >
                <TestsTable tests={shownTests} onClickTest={redirectToTestPage} />
              </InfiniteScroll> 
            </div>
          </div>
          ) 
          }
      
      <WithPermission allowedRoles={["ADMIN"]}>
        <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
          <Button bgColor={"gray.300"} onClick={redirectToTestCreation}>
            Criar Teste
          </Button>
        </div>
      </WithPermission>
    </div>
  );
}


