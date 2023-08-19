import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
} from "@chakra-ui/react";
import { ITestInputModel, ISampleInputModel } from "../../common/Interfaces/Tests";
import { createProduct, createTest, fetchAllClients } from "../../common/APICalls";
import { useGlobalToast } from "../../common/useGlobalToast";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../../components/tables/ProductsTable";
import { ProductInputModel, ProductOutputModel } from "../../common/Interfaces/Products";
import CreateProductModal from "../../components/modals/CreateProductModal";
import AddProductsModal from "../../components/modals/AddProductModal";
import DraggableProductTable from "../../components/tables/DraggableProductTable";
import { IClientOutputModel } from "../../common/Interfaces/Clients";

const initialFormValues: ITestInputModel = {
  id: "",
  testType: "SP",
  consumersNumber: 0,
  product : undefined,
  clientId : "cliente",
  requestDate: "",
  samples : []
};

export default function TestCreation(): React.ReactElement {
  const [formValues, setFormValues] = useState<ITestInputModel>(initialFormValues);
  const [addedProducts, setAddedProducts] = useState<ProductOutputModel[]>([])
  const [productToTestReference, setProductToTestReference] = useState<string>("")
  const [availableClients, setAvailableClients] = useState<IClientOutputModel[]>([])
  const { addToast, isToastActive } = useGlobalToast() 
  const navigate = useNavigate()

  const onCreateProduct = async (product : ProductInputModel) => {
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
      setAddedProducts(prevProducts => [...prevProducts, (product as ProductOutputModel)])
    }
  }
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "consumersNumber") {
        const parsedValue = parseInt(value, 10);
        const newValue = parsedValue >= 0 ? parsedValue : 0;
    
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: newValue,
        }));
      } else {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }

      console.log(formValues)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    formValues.samples = addedProducts.map((p, idx) => ({ProductId: p.productid, PresentationPosition : idx})) as ISampleInputModel[]
    const resp = await createTest(formValues).catch(err => {
      console.log(err)
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
      const toastObj = {id: "success", title: "Sucesso", description: "Teste criado com sucesso.", status: "success"}
      const location = resp!.headers.location.split("/api")[1]
      navigate(location, {state: toastObj})
    }
  };


  function addSampleToTest(product : ProductOutputModel) {
    setAddedProducts([...addedProducts, product])
  }

  function setProductToTest(product : ProductOutputModel) {
    setAddedProducts([...addedProducts, product])
    formValues.product = product.productid
    setProductToTestReference(product.ref)
  }

  function cleanProductToTest(){
    let _addedProducts = [...addedProducts]
    let toRemove = addedProducts.findIndex(v => v.productid == formValues.product)
    if(toRemove != -1) {
      _addedProducts.splice(toRemove, 1)
      setAddedProducts([..._addedProducts])
    }
    formValues.product = NaN
    setProductToTestReference("")
  }

  const isHomeTest = formValues.testType === "HT";
  fetchAllClients().then(res => setAvailableClients(res.data)) 
  return (
    <div className="flex flex-col bg-slate-800 shadow-slate-600 p-6 rounded-lg shadow-md ">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-center text-3xl font-bold text-white">Criar Teste</h1>
        </div>
        <div className="flex flex-row gap-10">
          <div className="flex flex-row">
            <form onSubmit={handleSubmit}>

              <FormControl id="client" isRequired>
                <FormLabel textColor={"white"}>ID</FormLabel>
                <Input
                  name="id"
                  type="text"
                  value={formValues.id}
                  onChange={handleInputChange}
                  background="white"

                />
              </FormControl>

              <FormControl id="clientId" isRequired>
                <FormLabel textColor={"white"}>Cliente</FormLabel>
                <Select
                  name="clientId"
                  value={formValues.clientId}
                  onChange={handleInputChange}
                  background="white"
                >
                  {availableClients && availableClients.map(c => (
                    <option key={c.clientId} value={c.clientId}>{c.clientDesignation}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="testType" isRequired>
                <FormLabel textColor={"white"}>Tipo</FormLabel>
                <Select
                  name="testType"
                  value={formValues.testType}
                  onChange={handleInputChange}
                  background="white"
                >
                  <option value="SP">Sala de Provas</option>
                  <option value="HT">Home Test</option>
                </Select>
              </FormControl>

              <FormControl id="consumersNumber" isRequired>
                <FormLabel textColor={"white"}>Número de Provadores</FormLabel>
                <Input
                  name="consumersNumber"
                  type="number"
                  value={formValues.consumersNumber}
                  onChange={handleInputChange}
                  background="white"

                />
              </FormControl>

              <FormControl className="flex flex-col p-2" id="requestDate" isRequired>
                <FormLabel textColor={"white"}>Data de Pedido</FormLabel>
                <Input
                  name="requestDate"
                  type="date"
                  value={formValues.requestDate}
                  onChange={handleInputChange}
                  background="white"

                />
              </FormControl>

              {isHomeTest && (
                <>
                  <FormControl className="flex flex-col p-2" id="validationDate">
                    <FormLabel textColor={"white"}>Validation Date</FormLabel>
                    <Input
                      name="validationDate"
                      type="date"
                      value={formValues.validationDate}
                      onChange={handleInputChange}
                      background="white"
              
                      />
                  </FormControl>
              
                  <FormControl className="flex flex-col p-2" id="dueDate">
                    <FormLabel textColor={"white"}>Due Date</FormLabel>
                      <Input
                        name="dueDate"
                        type="date"
                        value={formValues.dueDate}
                        onChange={handleInputChange}
                        background="white"
              
                      />
                  </FormControl>
              
                  <FormControl className="flex flex-col p-2" id="reportDeliveryDate">
                    <FormLabel textColor={"white"}>Report Delivery Date</FormLabel>
                      <Input
                        name="reportDeliveryDate"
                        type="date"
                        value={formValues.reportDeliveryDate}
                        onChange={handleInputChange}
                        background="white"
                      />
                  </FormControl>
                </>
              )}
              
                <FormControl id="product" className="bg-slate-600 rounded-lg flex flex-col items-center" isRequired>
                  <FormLabel textColor={"white"}>Produto em teste</FormLabel>
                  {productToTestReference === "" ? (
                      <div>
                        <AddProductsModal onClickProduct={setProductToTest} excludeProducts={addedProducts} onClickCreateProduct={onCreateProduct} buttonText={"Associar produto"}/>
                      </div>
                  ) : 
                  (
                    <Input className="text-neutral-50 items-center"
                      name="product"
                      type="text"
                      value={productToTestReference}
                      isReadOnly
                      border={"hidden"}
                      textAlign={"center"}
                      onDoubleClick={() => cleanProductToTest()}
                    >                     
                    </Input>
                  )}
                </FormControl>
              
              
              <Button type="submit" mt={4} colorScheme="blue">
                  Submit
              </Button>
            </form>
          </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-white">Ordem de amostragem</h2>
          <div className="w-full flex-grow bg-white rounded-md ">
            <DraggableProductTable elements={addedProducts} setElements={setAddedProducts} productToTest={formValues.product}></DraggableProductTable>
          </div>
          <div className="flex w-full gap-4">
            <AddProductsModal onClickProduct={addSampleToTest} excludeProducts={addedProducts} onClickCreateProduct={onCreateProduct} buttonText="Adicionar amostras"/>
          </div>
        </div>
      </div>
    </div>
  );
}
