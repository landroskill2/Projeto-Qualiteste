import { changeFizzAttributesAlias, getFizzTableValues } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React from "react";
import { useEffect, useState } from "react";
import { IFizzValues, ISampleOutputModel } from '../../common/Interfaces/Tests';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading, Spinner, Collapse } from "@chakra-ui/react";
import { AttributeAliasField } from '../../components/AttributeAliasField';
import FizzAttribute from '../../common/Interfaces/FizzAttributes';
import { useGlobalToast } from '../../common/useGlobalToast';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import WithPermission from '../../auth/WithPermission';

export default function FizzResults(): React.ReactElement {
  const [data, setData] = useState<IFizzValues | null>(null);
  const [commonColumns, setCommonColumns] = useState<Record<string, string>>({});
  const [productColumns, setProductColumns] = useState<Record<string, string>[]>([]);
  const [productOrder, setProductOrder] = useState<ISampleOutputModel[]>([])
  const [textHeight, setTextHeight] = useState<number>(0);
  const [changedAlias, setChangedAlias] = useState<FizzAttribute[]>([])
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {addToast, isToastActive} = useGlobalToast()
  const {state} = useLocation()
  const [show, setShow] = useState<boolean[]>()
  const navigate = useNavigate()

  //test id
  const { id } = useParams();

  useEffect(() => {
    if(state !== null){
      if(!isToastActive("success")){
        addToast(state)
      }
    }
    populateValues().then(() => setIsLoading(false))
  }, []);

  useEffect(()=>{
     //set missing consumers on session as red
     data?.consumersInfo.filter(e => e.presence == 1).forEach(e => {
      document.querySelectorAll('.row'+e.id.toString()).forEach(c => {
        c.classList.add("bg-red-300")
      })
      document.querySelectorAll('.td'+e.id.toString()).forEach(c => {
        c.classList.replace("hover:bg-slate-200", "hover:bg-red-400")
      })
    })
  }, [data])

  function addChangedAlias(attr : FizzAttribute){
    setChangedAlias(
      [
        ...changedAlias,
        attr
      ]
    )
  }

  const handleShowToggle = (index : number) => {
    show![index] = !show![index]
    setShow([...show!])
  }

  async function onSave() {
    setEditMode(false)
    const resp = await changeFizzAttributesAlias(id!, changedAlias)
    if(resp.status === 200) {
      setIsLoading(true)
      populateValues().then(() => {
        setIsLoading(false)
        if(!isToastActive){
          addToast({id: "success", title: "Sucesso", description: "Nome do atributo alterado com sucesso.", status: "success"})
        }
      })
    }
  }

  async function populateValues() {
    const res = await getFizzTableValues(id!);
    const jsonData = res.data
    setData(jsonData as IFizzValues);
    setProductOrder((jsonData as IFizzValues).samplesOrder)
    separateValues(jsonData as IFizzValues);
  }

  function separateValues(values: IFizzValues) {
    const newCommonColumns: Record<string, string> = {};
    const newProductColumns: Record<string, string>[] = [];

    for (const columnName in values.columns) {
      const columnValue = values.columns[columnName];
      
      const product = columnName.slice(columnName.indexOf("_")+1)
      //if product string doesnt have "P" then its not data about a product
      if (!product.match("P")) {
        newCommonColumns[columnName] = columnValue;
      } else {
        const productIndex = columnName.indexOf("_");
        const productKey = columnName.slice(0, productIndex + 3);

        // Find the corresponding product object or create a new one
        let productObj = newProductColumns.find((obj) => obj.productKey === productKey);
        if (!productObj) {
          productObj = { productKey };
          newProductColumns.push(productObj);
        }
        //adds consumer id to the productObj
        productObj["CJ"] = values.columns["CJ"]
        // Add the column to the product object
        productObj[columnName] = columnValue;

      }
    }
    setCommonColumns(newCommonColumns);
    setProductColumns(newProductColumns);
    setShow(Array(newProductColumns.length).fill(false))
  }
  

  return (
    <>
      {isLoading && 
        <div className="flex flex-col justify-center items-center h-full">
          <Spinner size="lg" />
        </div>||
        <div className='flex flex-col flex-grow justify-center items-center w-full m-4'>
          <div className='flex flex-row w-full'>
            <div className='flex flex-row flex-grow justify-between mx-4 rounded-lg bg-slate-100 border-2 items-center'>
              <div className='ml-1 hover:bg-slate-300 cursor-pointer rounded-lg ' onClick={()=> navigate(`/tests/${id}`)}>
                <Heading px={4} >Teste {id}</Heading>
              </div>
              
              <div className='gap-4 py-2 mr-4'>
                  {!editMode && 
                    <Button bgColor={"gray.300"} onClick={() => setEditMode(true)}>Editar nomes</Button>
                    ||
                    <div className='flex flex-row gap-2'>
                      <Button bgColor={"gray.300"} onClick={() => onSave()}>Guardar</Button>
                      <Button bgColor={"gray.300"} onClick={() => setEditMode(false)}>Cancelar</Button>
                    </div>
                    }
              </div>
            </div>  
          </div>
          <div className='flex w-full flex-grow flex-col '>
            <div className='flex flex-col rounded-md m-4 h-96'>
              {data && (
                <div className='border-2 rounded-lg border-slate-300 h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'>
                  <Table variant="simple" size="sm" >
                    <Thead position='sticky' top={0} zIndex="docked" className="rounded-lg bg-slate-300 ">
                      <Tr className='flex-grow w-full '>
                        {Object.entries(commonColumns).map(([columnName, columnValue]) => {
                          if(columnName == "CJ"){
                            return <WithPermission allowedRoles={["ADMIN"]}>
                                      <Th key={columnName}> 
                                        <AttributeAliasField name={columnName} value={columnValue} editMode={editMode} addChangedAlias={addChangedAlias}></AttributeAliasField>
                                      </Th>
                                    </WithPermission>
                          }
                          return <Th key={columnName}>
                                    <AttributeAliasField name={columnName} value={columnValue} editMode={editMode} addChangedAlias={addChangedAlias}></AttributeAliasField>
                                </Th>
                        }
                        )}
                      </Tr>
                    </Thead>
                    <Tbody className="w-full h-96" overflowY={"scroll"}>
                        {data.rows.map((row, index) => (
                          <Tr className={"row"+Number(row["CJ"]).toString()}>
                            
                              {Object.entries(commonColumns).map(([columnName, _]) => {
                                {if(columnName == "CJ"){
                                  let value = data!.consumersInfo.find(e => e.id == Number(row[columnName])) ? data!.consumersInfo.find(e => e.id == Number(row[columnName]))?.consumerName : row[columnName]
                                  return (
                                    <WithPermission allowedRoles={["ADMIN"]}>
                                      <Td className={"td"+Number(row["CJ"]).toString()+' hover:bg-slate-200 cursor-pointer'} onClick={()=>navigate(`/consumers/${row[columnName]}`)} id={"td"+Number(row["CJ"]).toString()}>{value}</Td>
                                    </WithPermission>
                                  )
                                }}
                                return <Td key={columnName}>{row[columnName]}</Td>
                              }
                              )}
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </div>
              )}
              
            </div>
            <div>
              {
                productColumns.map((product, index) =>{
                  return (
                      <div className='flex flex-col rounded-md m-4 border-slate-300 border-2 shadow-md'>
                        <div className='flex justify-between hover:bg-slate-300 cursor-pointer' onClick={() => handleShowToggle(index)}>
                        <Heading className='m-4' >{(productOrder.find(p => p.presentationPosition === index)?.product.ref)} - {(productOrder.find(p => p.presentationPosition === (index))?.product.designation)}</Heading>
                        {!show![index] && <ChevronDownIcon className="self-center mr-4" boxSize={8}></ChevronDownIcon> || <ChevronUpIcon className="self-center mr-4" boxSize={8}></ChevronUpIcon>}
                        </div>
                        <Collapse in={show![index]}>
                        <div key={product.productKey} className='h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'>
                          <Table variant="simple" size="sm" >
                            <Thead position='sticky' top={0} zIndex="docked" className="rounded-lg bg-slate-300 ">
                              <Tr className='flex-grow w-full'>{
                                Object.entries(product).map(([columnName, columnValue]) => {
                                  if (columnName !== "productKey") {
                                    if(columnName == "CJ"){
                                      return <WithPermission allowedRoles={["ADMIN"]}>
                                                <Th key={columnName}> 
                                                  <AttributeAliasField name={columnName} value={columnValue} editMode={editMode} addChangedAlias={addChangedAlias}></AttributeAliasField>
                                                </Th>
                                              </WithPermission>
                                    }
                                    return <Th key={columnName}> 
                                            <AttributeAliasField name={columnName} value={columnValue} editMode={editMode} addChangedAlias={addChangedAlias}></AttributeAliasField>
                                           </Th>;
                                  }
                                })
                              }</Tr>
                            </Thead>
                            <Tbody>
                              {data?.rows.map((row, rowIndex) => (
                                <Tr className={"row"+Number(row["CJ"]).toString()}>
                                  {Object.entries(product).map(([columnName, _]) => {
                                    if (columnName !== "productKey") {
                                      {if(columnName == "CJ"){
                                        let value = data!.consumersInfo.find(e => e.id == Number(row[columnName])) ? data!.consumersInfo.find(e => e.id == Number(row[columnName]))?.consumerName : row[columnName]
                                        return (
                                          <WithPermission allowedRoles={["ADMIN"]}>
                                            <Td className={"td"+Number(row["CJ"]).toString()+' hover:bg-slate-200 cursor-pointer'} onClick={()=>navigate(`/consumers/${row[columnName]}`)} id={"td"+Number(row["CJ"]).toString()}>{value}</Td>
                                        </WithPermission>
                                        )
                                      }}
                                      return <Td key={columnName}>{row[columnName]}</Td>;
                                    }
                                  return null;
                                  })}
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </div>
                        </Collapse>
                    </div>                  
              )
            })
          }
          </div>
        </div>
      </div>
      }
    </>
  );
  
}