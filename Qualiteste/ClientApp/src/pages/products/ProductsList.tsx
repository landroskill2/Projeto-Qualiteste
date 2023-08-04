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
import Product from "../../common/Interfaces/Products";


export default function Consumers(): React.ReactElement{
    const [products, setProducts] = useState<Product[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [brands, setBrands] = useState<string[]>([])
    const [type, setType] = useState<string | null>(null)
    const [searchString, setSearchString] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [brand, type, searchString]);

  async function populateData() {
    const filters = Object.assign(
      {},
      brand === null ? null : {brand: brand},
      type === null ? null : {type: type},
      searchString === null ? null : {name: searchString}
    )

    const response = await fetchConsumers(filters)
    setProducts(response.data)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col flex-grow w-full min-h-full">
      <div className="mt-5">
        <h1 className="text-5xl font-bold text-center bg-white">Produtos</h1>
      </div>
      {products === null ? (
        <div className="min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="mt-6 px-6 min-h-full w-full flex flex-col flex-grow items-center justify-center">
          <div className="w-full">
            <FilterBar brands={brands} setBrands={setBrands} setType={setType} setSearchString={setSearchString} searchBar />
          </div>
          <div className="mt-3 w-full" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
            <ProductsTable products={products} />
          </div>
        </div>
      )}
      <div className="content-end justify-end items-baseline">
        <WithPermission roleRequired="ADMIN">
          <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
            <Button colorScheme="blue" onClick={}>
              Criar Produto
            </Button>
          </div>
        </WithPermission>
      </div>
    </div>
  );  
}


