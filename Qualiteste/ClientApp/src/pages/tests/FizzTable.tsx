import { changeFizzAttributesAlias, getFizzTableValues } from '../../common/APICalls';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React from "react";
import { useEffect, useState } from "react";
import { IFizzValues, ISampleOutputModel } from '../../common/Interfaces/Tests';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading, Spinner } from "@chakra-ui/react";
import { AttributeAliasField } from '../../components/AttributeAliasField';
import FizzAttribute from '../../common/Interfaces/FizzAttributes';
import { useGlobalToast } from '../../common/useGlobalToast';

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

  function addChangedAlias(attr : FizzAttribute){
    setChangedAlias(
      [
        ...changedAlias,
        attr
      ]
    )
  }

  async function onSave() {
    setEditMode(false)
    console.log(changedAlias)
    const resp = await changeFizzAttributesAlias(id!, changedAlias)
    console.log(resp)
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
        //if(columnName == "CJ")productObj["CJ"] = data!.consumersInfo.find(e => e.id == Number(columnValue) )!.consumerName
      }
    }
    setCommonColumns(newCommonColumns);
    setProductColumns(newProductColumns);
  }
  //set missing consumers on session as red
  data?.consumersInfo.filter(e => e.presence == 1).forEach(e => {
    document.querySelectorAll('.row'+e.id.toString()).forEach(c => c.classList.add("bg-red-300"))
  })

  return (
    <>
      <div className='flex justify-center items-center border-2 rounded-lg m-4 h-12 bg-slate-300'>
        Insert Test Id, date and belonging session here
      </div>
      {isLoading && 
        <div className="flex flex-col justify-center items-center h-full">
          <Spinner size="lg" />
        </div>||
        <div className='flex w-full flex-grow flex-col '>
          <div className='flex flex-col rounded-md m-4 h-96'>
            {data && (
              <div className='border-2 rounded-lg border-slate-300 h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'>
                <Table variant="simple" size="sm" >
                  <Thead position='sticky' top={0} zIndex="docked" className="rounded-lg bg-slate-300 ">
                    <Tr className='flex-grow w-full '>
                      {Object.entries(commonColumns).map(([columnName, columnValue]) => (
                        <Th key={columnName}>
                          <AttributeAliasField name={columnName} value={columnValue} editMode={editMode} addChangedAlias={addChangedAlias}></AttributeAliasField>
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody className="w-full h-96" overflowY={"scroll"}>
                      {data.rows.map((row, index) => (
                        <Tr className={"row"+Number(row["CJ"]).toString()}>
                          {Object.entries(commonColumns).map(([columnName, _]) => (
                            <Td key={columnName}>{row[columnName]}</Td>
                          ))}
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            )}
            <div className='gap-4 py-2'>
              {!editMode && 
                <Button onClick={() => setEditMode(true)}>Editar nomes</Button>
                ||
                <div className='flex flex-row w-1/5 gap-2'>
                  <Button onClick={() => onSave()}>Guardar</Button>
                  <Button onClick={() => setEditMode(false)}>Cancelar</Button>
                </div>
                }
            </div>
          </div>
          <div>
            {
              productColumns.map((product, index) =>{
                return (
                  <>
                    <Heading className='mx-6 mt-3'>{(productOrder.find(p => p.presentationPosition === index)?.productRef)} - {(productOrder.find(p => p.presentationPosition === (index))?.productDesignation)}</Heading>
                    <div key={product.productKey} className='flex flex-col m-4 h-96 border-2 rounded-lg border-slate-300 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-lg scrollbar-track-slate-300'>
                      <Table variant="simple" size="sm" >
                        <Thead position='sticky' top={0} zIndex="docked" className="rounded-lg bg-slate-300 ">
                          <Tr className='flex-grow w-full'>{
                            Object.entries(product).map(([columnName, columnValue]) => {
                              if (columnName !== "productKey") {
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
                            return <Td key={columnName}>{row[columnName]}</Td>;
                          }
                          return null;
                        })}
                      </Tr>
                    ))}
                      </Tbody>
                    </Table>
                    
                </div>
                <div className='gap-4 py-2'>
                    {!editMode && 
                      <Button onClick={() => setEditMode(true)}>Editar nomes</Button>
                      ||
                    <div className='flex flex-row w-1/5 gap-2'>
                      <Button onClick={() => onSave()}>Guardar</Button>
                      <Button onClick={() => setEditMode(false)}>Cancelar</Button>
                    </div>
                    }
                </div>
              </>
            )         
          })
        }
        </div>
      </div>
      }
    </>
  );
  
}