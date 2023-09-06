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
import { IConsumerOutputModel } from "../../common/Interfaces/Consumers";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalToast } from "../../common/useGlobalToast";
import FilterBar from "../../components/FilterBar";
import { fetchConsumers } from "../../common/APICalls";
import ConsumersTable from "../../components/tables/ConsumersTable";
import WithPermission from "../../auth/WithPermission";
import InfiniteScroll from "react-infinite-scroll-component";


export default function Consumers(): React.ReactElement{
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [shownConsumers, setShownConsumers] = useState<IConsumerOutputModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sex, setSex] = useState(null)
    const [maxAge, setMaxAge] = useState<number>(100)
    const [minAge, setMinAge] = useState<number>(0)
    const [searchString, setSearchString] = useState(null)
    const [currentIdx, setCurrentIdx] = useState(20)
    const {state} = useLocation()
    const { addToast, isToastActive } = useGlobalToast() 
    const navigate = useNavigate()

  useEffect(() => {
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }
    populateData()

  }, [sex, maxAge, minAge, searchString]);

  useEffect(() => {
    if(consumers != null){
      setShownConsumers(consumers!.slice(0, currentIdx))
    }
    
  },[consumers])

  function updateShownConsumers()
  {
    let nextIdx = currentIdx + 20 > consumers!.length ? consumers!.length : currentIdx + 20
    const consumersToAdd = consumers!.slice(currentIdx, nextIdx)
    setShownConsumers((prevItems) => [...prevItems, ...consumersToAdd] )
    setCurrentIdx(nextIdx)
  }

  const redirectToConsumerCreation = () => {
    navigate("create")
  };

  const redirectToConsumerPage = (id: number) => {
    navigate(`${id}`)
  }

  async function populateData() {
    const filters = Object.assign(
      {},
      sex === null ? null : {sex: sex},
      minAge === null ? null : {minAge: minAge},
      maxAge === null ? null : {maxAge: maxAge},
      searchString === null ? null : {name: searchString}
    )

    const response = await fetchConsumers(filters)
    
      setConsumers(response.data)
      setIsLoading(false)
  
    
  }

  return (
    <div className="flex flex-col flex-grow w-full min-h-full">
      <div className="mt-5">
        <h1 className="text-5xl font-bold text-center bg-white">Provadores</h1>
      </div>
      {consumers === null ? (
        <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <div className="w-full">
            <FilterBar setSex={setSex} setMinAge={setMinAge} setMaxAge={setMaxAge} setSearchString={setSearchString} searchBar />
          </div>
          <div className="border-2 h-1/2 overflow-hidden w-full m-2 rounded-lg border-slate-500 bg-slate-100 flex-grow " style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
            <InfiniteScroll
              dataLength={shownConsumers.length}
              next={updateShownConsumers}
              hasMore={shownConsumers.length != consumers.length}
              loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
              endMessage={<></>}
              height={"calc(100vh - 375px)"}
              className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
              >
              <ConsumersTable consumers={shownConsumers} onClickConsumer={redirectToConsumerPage} />
            </InfiniteScroll>
            
          </div>
        </div>
      )
      }
      <div className="content-end justify-end items-baseline">
        <WithPermission allowedRoles={["ADMIN"]}>
          <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
            <Button bgColor={"gray.300"} onClick={redirectToConsumerCreation}>
              Criar Provador
            </Button>
          </div>
        </WithPermission>
      </div>
    </div>
  );  
}


