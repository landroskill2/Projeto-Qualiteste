import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button, Input, Heading } from "@chakra-ui/react";
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { ISessionModel } from '../../common/Interfaces/Sessions';
import { ISampleOutputModel, ITestOutputModel } from '../../common/Interfaces/Tests';
import { addConsumerToTest, fetchClientTestById, fetchTestById, uploadFile, removeResultsFromTest } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import AddConsumersModal from "../../components/modals/AddConsumersModal";
import { useGlobalToast } from "../../common/useGlobalToast";
import { useAuth } from "../../auth/useAuth";
import WithPermission from "../../auth/WithPermission";
import { ProductOutputModel } from "../../common/Interfaces/Products";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function Test(): React.ReactElement {
  const [session, setSession] = useState<ISessionModel | null>(null);
  const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
  const [test, setTest] = useState<ITestOutputModel | null>(null);
  const [samples, setSamples] = useState<ISampleOutputModel[]>([])
  const [hasResults, setHasResults] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast, isToastActive } = useGlobalToast() 
  const {state} = useLocation()
  const user = useAuth()

  const redirectToSessionPage = (id: string) => {
    navigate(`/sessions/${id}`);
  };

  const redirectToConsumerPage = (id: number) => {
    navigate(`/consumers/${id}`);
  };

  const addConsumers = async (consumers : number[]) => {
    const resp = await addConsumerToTest(id!, consumers).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })
    if(resp?.status === 200){
      setIsLoading(true)
      populateData().then(() => {
        setIsLoading(false)
        addToast({id: "success", title: "Sucesso", description: "Provador adicionado com sucesso.", status: "success"})
      })   
    }
  }

  useEffect(() => {
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }
    populateData().then(() => {
      setIsLoading(false)
    });

  }, []);

  async function populateData(){
    try {
      let response
      if(user?.role === 'CLIENT'){
        response = await fetchClientTestById(id!!)
      }
      else{
        response = await fetchTestById(id!!)
    }
      
      const data = response.data

      setSession(data.session);
      setConsumers(data.consumers);
      setTest(data.test);
      setSamples(data.samples)
      setHasResults(data.hasResults)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) {
      const resp = await uploadFile(id!, file)
      console.log(resp)
      if(resp.status === 201) {
        const toastObj = {id: "success", title: "Sucesso", description: "Ficheiro processado com sucesso.", status: "success"}
        const location = resp!.headers.location.split("/api")[1]
        navigate(location, {state: toastObj})
      }
    }
  };

  const handleResultsRemoval = async (testId : string) => {
    const response = await removeResultsFromTest(testId).catch(err => {
      addToast({id: "error", title: "Erro", description: err.response.data.title, status: "error"})
    })
    if(response?.status === 200){
      addToast({id: "success", title: "Sucesso", description: response.data, status: "success"})
    }
  }

  const checkForResults = async (testId : string) => {
    
  }

  const isHomeTest = test?.type === "HT";

  if (isLoading) {
    // Render a loading spinner while waiting for the API response
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <>
      {isLoading && 
        <div className="flex flex-col justify-center items-center h-screen">
          <Spinner size="lg" />
        </div> || 
        <div className="flex flex-col w-full h-[calc(100vh-72px)] overflow-y-hidden">
          <div className="flex justify-between content-center m-4 h-fit">
            <div className="flex flex-col flex-grow shadow-2xl self-center rounded-xl bg-slate-100 h-full m-4 mt-10">
              <div className="flex justify-between items-center">
                <Heading size={"lg"} className="self-center ml-4">Dados do Teste</Heading>
                <WithPermission allowedRoles={["ADMIN"]}>
                  {!isHomeTest &&
                    <div className="flex m-4">
                      <Input type="file" accept=".txt,.csv" onChange={handleFileUpload} display="none" id="file-upload" />
                      <label htmlFor="file-upload">
                        <Button bgColor={"gray.300"} as="span" mr={2} className=" cursor-pointer">
                          Importar resultados
                        </Button>
                      </label>
                      { hasResults &&
                        <div className="flex flex-grow rounded-lg p-2 self-center gap-1 hover:bg-slate-200 cursor-pointer" onClick={() => navigate("fizz")}>
                          <Heading size={"md"} className="self-center ml-4">Resultados do Teste</Heading>
                          <div>
                            <ArrowForwardIcon boxSize={6}/>
                          </div>
                        </div>
                      }
                      
                    </div>
                  }                                  
                </WithPermission>
              </div>
              <div className="flex flex-row justify-center content-center border-2 h-fit overflow-x-auto overflow-y-hidden m-4 rounded-lg border-slate-500 flex-grow scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'">
                <div className="flex flex-col flex-grow border-r-2 border-slate-500">
                  <div className="flex justify-center items-center p-4 border-b-2 border-slate-500 h-1/3 bg-slate-300">
                    <Heading size={"md"}>Id do Teste</Heading>
                  </div>
                  <div  className="flex h-2/3 justify-center items-center">
                    <Heading size={"md"}>{test?.id}</Heading>    
                  </div>
                </div>
                <WithPermission allowedRoles={["ADMIN"]}>
                  {!isHomeTest &&
                    <div className="flex flex-col flex-grow border-r-2 border-slate-500">
                      <div  className="flex justify-center items-center p-4 border-b-2 border-slate-500 h-1/3 bg-slate-300 hover:bg-slate-400 cursor-pointer" onClick={() => {navigate(`/sessions/${session?.id}`) }}>                    
                        <Heading size={"md"}>Sessão do Teste</Heading>
                        <ArrowForwardIcon ml={1} boxSize={6}/>
                      </div>
                      <div  className="flex h-2/3 justify-center items-center">
                        
                        <Heading size={"md"}>{session?.id}</Heading>   
                      </div>
                    </div>
                  }
                </WithPermission>
                <div className="flex flex-col flex-grow border-r-2 border-slate-500">
                  <div  className="flex justify-center items-center p-4 border-b-2 border-slate-500 h-1/3 bg-slate-300">                    
                    <Heading size={"md"}>Tipo de Teste</Heading>
                  </div>
                  <div  className="flex h-2/3 justify-center items-center">
                    
                    <Heading size={"md"}>{test?.type}</Heading>   
                  </div>
                </div>
                <div className="flex flex-col flex-grow border-r-2 border-slate-500">
                  <div  className="flex h-1/3 items-center border-b-2 p-4 border-slate-500 bg-slate-300 justify-center">
                    
                    <Heading size={"md"}>Número de provadores pretendidos</Heading>
                  </div>
                  <div  className="flex h-2/3 justify-center items-center">                    
                    <Heading size={"md"}>{test?.consumersNumber}</Heading>
                  </div>
                </div>
                <div className="flex flex-col flex-grow border-r-2 border-slate-500">
                  <div  className="flex justify-center border-b-2 p-4 border-slate-500 items-center h-1/3 bg-slate-300">
                    
                    <Heading size={"md"}>Produto principal</Heading>
                  </div>
                  <div  className="flex h-2/3  justify-center items-center">
                    <Heading size={"md"}>{test?.product.ref}</Heading>
                    
                  </div>
                </div>
                <div className="flex flex-col flex-grow">
                  <div  className="flex justify-center border-b-2 p-4 border-slate-500 h-1/3 items-center bg-slate-300">
                    
                    <Heading size={"md"}>Data de pedido</Heading>
                  </div>
                  <div  className="flex h-2/3  justify-center items-center">
                    <Heading size={"md"}>{test?.requestDate}</Heading>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-grow w-fit h-3/5 self-center">
            <div className="flex flex-col w-2/3 mx-10 flex-grow justify-center content-center">
              <div className="flex flex-row flex-grow shadow-2xl w-full m-5 self-center rounded-xl bg-slate-100 h-2/3 gap-4 justify-center">  
                <WithPermission allowedRoles={["ADMIN"]}>
                  <div className="flex flex-col min-w-1/2">
                    <div className="flex justify-between">
                      <Heading size={"md"} className="self-center ml-4">Provadores do Teste</Heading>
                      {isHomeTest && 
                        <AddConsumersModal onSubmit={addConsumers}/>
                      }
                    </div>
                    <div className=" overflow-x-hidden border-2 h-full m-4 rounded-lg border-slate-500 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg">
                      <Table variant="simple" className="">
                        <Thead top={0} zIndex="docked" position={"sticky"} className="rounded-lg bg-slate-300">
                          <Tr>
                            <Th>ID</Th>
                            <Th>Nome</Th>
                            <Th>Idade</Th>
                            <Th>Sexo</Th>
                            <Th>Contacto</Th>
                            <Th>Email</Th>
                          </Tr>
                        </Thead>
                        <Tbody>

                          {consumers && (
                            <>
                              {consumers.map(consumer => (
                                <Tr className="hover:bg-slate-200 cursor-pointer" key={consumer.id} onClick={() => redirectToConsumerPage(consumer.id)}>
                                  <Td>{consumer.id}</Td>
                                  <Td>{consumer.fullname}</Td>
                                  <Td>{consumer.age}</Td>
                                  <Td>{consumer.sex}</Td>
                                  <Td>{consumer.contact}</Td>
                                  <Td>{consumer.email || "-"}</Td>
                                </Tr>
                              ))}
                            </>
                          )}
                          {!consumers && (
                            <>
                              <p>Sem dados.</p>
                            </>
                          )}
                        </Tbody>
                      </Table>
                    </div>
                  </div>              
                </WithPermission>            
                
                <div className="flex flex-col min-w-1/2">      
                  <div className="flex justify-between">
                    <Heading size={"md"} className="self-center ml-4">Produtos do Teste</Heading>
                  </div>
                  <div className=" overflow-x-auto border-2 h-full m-4 rounded-lg border-slate-500 overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg">
                    <Table variant="simple" overflow="auto">
                      <Thead top={0} zIndex="docked" position={"sticky"} className="rounded-lg bg-slate-300 border-b-2">
                        <Tr>
                          <Th>Referência</Th>
                          <Th>Designação</Th>
                          <Th>Marca</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {samples && <>
                          {samples.map((s) => (
                            <Tr className="hover:bg-slate-200 cursor-pointer" key={s.product.productid} >
                              <Td>{s.product.ref}</Td>
                              <Td>{s.product.designation}</Td>
                              <Td>{s.product.brand}</Td>
                            </Tr>
                          ))}
                        </>}             
                      </Tbody>
                    </Table>                 
                  </div>                  
                </div>
              </div>  
            </div>
          </div>
        </div>
      }
    {/* <div className='flex flex-col flex-grow w-full min-h-full p-6'>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box as="h1" fontSize="2xl" fontWeight="bold">
            TestID = {test?.id} 
          </Box>

          <WithPermission allowedRoles={["ADMIN"]}>
            {isHomeTest && 
              <Box>
                <AddConsumersModal onSubmit={addConsumers}/>
              </Box>
            }
          </WithPermission>
          
          {!isHomeTest &&
          <>
            <Box>
              <Button onClick={() => navigate("fizz")}>Fizz Results</Button>
            </Box>
            <WithPermission allowedRoles={["ADMIN"]}>
              <Box>
                <Input type="file" accept=".txt,.csv" onChange={handleFileUpload} display="none" id="file-upload" />
                  <label htmlFor="file-upload">
                  <Button as="span" colorScheme="blue" mr={2}>
                    Upload File
                  </Button>
                </label>
              </Box>
            </WithPermission>
            
          </>
          }


        </Box>
        <Box className="hover:cursor-pointer" as="h1" fontSize="2xl" fontWeight="bold" mb={4} onClick={() => redirectToSessionPage(session!.id)}>
          {session?.id}
        </Box>
        <Box as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
          Number of Consumers: {test?.consumersNumber.toString()}
        </Box>
        <WithPermission allowedRoles={["ADMIN"]}>
          
        </WithPermission>
        
      </Box>
    </div> */}
    </>
  );
}
