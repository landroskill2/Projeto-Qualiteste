import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { useGlobalToast } from "../../../common/useGlobalToast";
import { useNavigate, useParams } from "react-router-dom";
import { createTest } from "../../../common/APICalls";
import { ITestInputModel } from "../../../common/Interfaces/Tests";

const initialFormValues: ITestInputModel = {
  id: "",
  testType: "SP",
  consumersNumber: 0,
  requestDate: "",
};

export default function ClientTestRequisition(): React.ReactElement {
  const [formValues, setFormValues] = useState<ITestInputModel>(initialFormValues);
  const { addToast, isToastActive } = useGlobalToast() 
  const navigate = useNavigate()
  const {clientID} = useParams()

  
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
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

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

  const isHomeTest = formValues.testType === "HT";

  return (
    <div className="flex flex-col bg-slate-800 shadow-slate-600 p-6 rounded-lg shadow-md ">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-center text-3xl font-bold text-white">Criar Teste</h1>
        </div>
        <div className="flex flex-row gap-10">
          <div className="flex flex-row">
            <form onSubmit={handleSubmit}>
              <FormControl id="id" isRequired>
                <FormLabel textColor={"white"}>ID</FormLabel>
                <Input
                  name="id"
                  type="text"
                  value={formValues.id}
                  onChange={handleInputChange}
                  background="white"

                />
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

              <FormControl id="requestDate" isRequired>
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
                  <FormControl id="validationDate">
                    <FormLabel textColor={"white"}>Validation Date</FormLabel>
                    <Input
                      name="validationDate"
                      type="date"
                      value={formValues.validationDate}
                      onChange={handleInputChange}
                      background="white"
              
                      />
                  </FormControl>
              
                  <FormControl id="dueDate">
                    <FormLabel textColor={"white"}>Due Date</FormLabel>
                      <Input
                        name="dueDate"
                        type="date"
                        value={formValues.dueDate}
                        onChange={handleInputChange}
                        background="white"
              
                      />
                  </FormControl>
              
                  <FormControl id="reportDeliveryDate">
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

              <Button type="submit" mt={4} colorScheme="blue">
                  Submit
              </Button>
            </form>
          </div>
      </div>
    </div>
  );
}
