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
import { ProductOutputModel } from "../../common/Interfaces/Products";
import { useNavigate } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import { getAvailableBrands, queryProducts } from "../../common/APICalls";
import ProductsTable from "../../components/tables/ProductsTable";
import WithPermission from "../../auth/WithPermission";


export default function Products(): React.ReactElement{
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [brands, setBrands] = useState<string[]>([])
    const [brandFilter, setBrandFilter] = useState<string|undefined>(undefined)
    const [type, setType] = useState<string | null>(null)
    const [searchString, setSearchString] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    populateData() 
  }, [type, searchString, brandFilter]);

  async function populateData() {
    const productsResponse = await queryProducts(brandFilter)
    const availableBrands = await getAvailableBrands()

    setProducts(productsResponse.data)
    setBrands(availableBrands.data.brands)
    setIsLoading(false)
  }

  console.log(products)
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
            <FilterBar brands={brands} setBrand={setBrandFilter} setType={setType} setSearchString={setSearchString} searchBar />
          </div>
          <div className="mt-3 w-full" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
            <ProductsTable products={products}/>
          </div>
        </div>
      )}
      <div className="content-end justify-end items-baseline">
        <WithPermission roleRequired="ADMIN">
          <div className="p-6 bg-white" style={{ flexShrink: 0 }}>
            <Button colorScheme="blue" onClick={() => {console.log("Clicked")}}>
              Criar Produto
            </Button>
          </div>
        </WithPermission>
      </div>
    </div>
  );  
}


