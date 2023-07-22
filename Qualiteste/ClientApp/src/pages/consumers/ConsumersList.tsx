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
import { useNavigate } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import { fetchConsumers } from "../../common/APICalls";
import ConsumersTable from "../../components/tables/ConsumersTable";
import WithPermission from "../../auth/WithPermission";


export default function Consumers(): React.ReactElement{
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sex, setSex] = useState(null)
    const [age, setAge] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [sex, age, searchString]);

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
      age === null ? null : {age: age},
      searchString === null ? null : {name: searchString}
    )

    const response = await fetchConsumers(filters)
    setConsumers(response.data)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col flex-grow w-full min-h-full">
        <div className="col-span-full">
          <h1 className="text-5xl font-bold text-center bg-white">Provadores</h1>
        </div>
        <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <div className="p-6 overflow-y-hidden w-full items-center justify-center">
            {consumers === null ? (
              <div className="flex justify-center items-center h-full self-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <FilterBar setSex={setSex} setAge={setAge} setSearchString={setSearchString} searchBar />
                </div>

                <div className="mt-10" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
                  <ConsumersTable consumers={consumers} onClickConsumer={redirectToConsumerPage} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="content-end justify-end items-baseline">
          <WithPermission roleRequired="ADMIN">
            <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
              <Button colorScheme="blue" onClick={redirectToConsumerCreation}>
                Criar Provador
              </Button>
            </div>
          </WithPermission>
        </div>
      </div>
  );  
}


