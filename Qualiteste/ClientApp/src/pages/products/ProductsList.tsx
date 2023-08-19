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
import { ProductInputModel, ProductOutputModel } from "../../common/Interfaces/Products";
import { useNavigate } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import { getAvailableBrands, queryProducts } from "../../common/APICalls";
import ProductsTable from "../../components/tables/ProductsTable";
import CreateProductModal from "../../components/modals/CreateProductModal";
import WithPermission from "../../auth/WithPermission";
import { createProduct } from "../../common/APICalls";
import { useGlobalToast } from "../../common/useGlobalToast";


export default function Products(): React.ReactElement{
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [brands, setBrands] = useState<string[]>([])
    const [brandFilter, setBrandFilter] = useState<string|undefined>(undefined)
    const [type, setType] = useState<string | null>(null)
    const [searchString, setSearchString] = useState(null)
    const { addToast, isToastActive } = useGlobalToast() 

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
  const onSubmitProduct = async (product : ProductInputModel) => {
    const resp = await createProduct(product).catch(err => {
      if(!isToastActive("error")){
        addToast({
          id: "error",
          title: "Erro",
          description: err.response.data.title,
          status: "error"
        })
      }
    })
    if(resp?.status === 201){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: resp.data, status: "success"})
      })
    }
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
            <FilterBar brands={brands} setBrand={setBrandFilter} setType={setType} setSearchString={setSearchString} searchBar />
          </div>
          <div className="mt-3 w-full" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
            <ProductsTable products={products}/>
          </div>
        </div>
      )}
      <div className="content-end justify-end items-baseline">
        <WithPermission allowedRoles= {["ADMIN"]}>
          <div className="p-6 bg-white " style={{ flexShrink: 0 }}>
            <CreateProductModal onSubmit={onSubmitProduct}/>
          </div>
        </WithPermission>
      </div>
    </div>
  );  
}


