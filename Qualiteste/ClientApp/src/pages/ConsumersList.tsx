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
import { IConsumerOutputModel } from "../common/Interfaces/Consumers";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import { fetchConsumers } from "../common/APICalls";


export default function Consumers(): React.ReactElement{
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sex, setSex] = useState(null)
    const [age, setAge] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [sex]);

  const redirectToConsumerCreation = () => {
    // TODO: Implement createConsumer function
  };

  async function populateData() {
    const filters = Object.assign(
      {},
      sex === null ? null : {sex: sex},
      age === null ? null : {age: age},
      searchString === null ? null : {nome: searchString}
    )

    const response = await fetchConsumers(filters).then(res => res.json())
    setConsumers(response)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ height: "100vh" }}>
      <div className="p-6 flex-grow overflow-y-auto">
        <h1 className="text-2xl font-bold text-center">Consumers</h1>
        <div className="flex-grow" style={{ flexShrink: 0 }}>
          {consumers === null ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <FilterBar
                setSex={setSex}
                setAge={setAge}
                setSearchString={setSearchString}
                searchBar
              />
              <Table mt={4} variant="striped">
                <Thead>
                  <Tr>
                    <Th>Fullname</Th>
                    <Th>Age</Th>
                    <Th>Sex</Th>
                    <Th>Contact</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {consumers.map((consumer) => (
                    <Tr key={consumer.contact}>
                      <Td>{consumer.fullname}</Td>
                      <Td>{consumer.age}</Td>
                      <Td>{consumer.sex}</Td>
                      <Td>{consumer.contact}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
        </div>
      </div>
      <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
        <Button colorScheme="blue" onClick={redirectToConsumerCreation}>
          Criar Consumidor
        </Button>
      </div>
    </div>
  );
}


