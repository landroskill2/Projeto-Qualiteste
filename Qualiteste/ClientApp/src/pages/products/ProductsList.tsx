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
import InfiniteScroll from "react-infinite-scroll-component";


export default function Products(): React.ReactElement{
    const [products, setProducts] = useState<ProductOutputModel[] | null>(null);
    const [shownProducts, setShownProducts] = useState<ProductOutputModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentIdx, setCurrentIdx] = useState(20)
    const [brands, setBrands] = useState<string[]>([])
    const [type, setType] = useState<string | null>(null)
    const [brandFilter, setBrandFilter] = useState<string|undefined>(undefined)
    const [searchString, setSearchString] = useState<string|undefined>(undefined)
    const { addToast, isToastActive } = useGlobalToast() 

  useEffect(() => {
    populateData() 
  }, [type, searchString, brandFilter]);

  useEffect(() => {
    if(products != null){
      setShownProducts(products!.slice(0, currentIdx))
    }
  },[products])

  function updateShownProducts()
  {
    let nextIdx = currentIdx + 20 > products!.length ? products!.length : currentIdx + 20
    const productsToAdd = products!.slice(currentIdx, nextIdx)
    setShownProducts((prevItems) => [...prevItems, ...productsToAdd] )
    setCurrentIdx(nextIdx)
  }
  
  async function populateData() {
    const filters = Object.assign(
      {},
      brandFilter === undefined? null : {brand: brandFilter},
      searchString === undefined ? null : {designation: searchString}
    )
    const productsResponse = await queryProducts(filters)
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
          <div className="border-2 h-1/2 overflow-y-auto w-full m-2 rounded-lg border-slate-500 bg-slate-100 flex-grow" style={{ maxHeight: 'calc(100vh - 370px)', overflowY: 'auto' }}>
            <InfiniteScroll
              dataLength={shownProducts.length}
              next={updateShownProducts}
              hasMore={shownProducts.length != products.length}
              loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
              endMessage={<></>}
              height={560}
              className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
            >
              <ProductsTable products={shownProducts}/>
            </InfiniteScroll>
          </div>
        </div>
        )    
      }
      <div className="content-end justify-end items-baseline">
        <WithPermission allowedRoles= {["ADMIN"]}>
          <div className="pl-2 pb-2 bg-white " style={{ flexShrink: 0 }}>
            <CreateProductModal onSubmit={onSubmitProduct}/>
          </div>
        </WithPermission>
      </div>
    </div>
  );  
}


