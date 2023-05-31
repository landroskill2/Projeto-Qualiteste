import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { ITestInputModel } from "../../common/Interfaces/Tests";
import { createTest } from "../../common/APICalls";

const initialFormValues: ITestInputModel = {
  id: "",
  testType: "SP",
  consumersNumber: 0,
  requestDate: "",
};

export default function TestCreation(): React.ReactElement {
  const [formValues, setFormValues] = useState<ITestInputModel>(initialFormValues);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTest(formValues)
  };

  const isHomeTest = formValues.testType === "HT";

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl id="id" isRequired>
          <FormLabel>ID</FormLabel>
          <Input
            name="id"
            type="text"
            value={formValues.id}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl id="testType" isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            name="testType"
            value={formValues.testType}
            onChange={handleInputChange}
          >
            <option value="SP">Sala de Provas</option>
            <option value="HT">Home Test</option>
          </Select>
        </FormControl>

        <FormControl id="consumersNumber" isRequired>
          <FormLabel>Consumers Number</FormLabel>
          <Input
            name="consumersNumber"
            type="number"
            value={formValues.consumersNumber}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl id="requestDate" isRequired>
          <FormLabel>Request Date</FormLabel>
          <Input
            name="requestDate"
            type="date"
            value={formValues.requestDate}
            onChange={handleInputChange}
          />
        </FormControl>

        {isHomeTest && (
          <>
            <FormControl id="validationDate">
              <FormLabel>Validation Date</FormLabel>
              <Input
                name="validationDate"
                type="date"
                value={formValues.validationDate}
                onChange={handleInputChange}
                />
            </FormControl>

            <FormControl id="dueDate">
              <FormLabel>Due Date</FormLabel>
                <Input
                  name="dueDate"
                  type="date"
                  value={formValues.dueDate}
                  onChange={handleInputChange}
                />
            </FormControl>

            <FormControl id="reportDeliveryDate">
              <FormLabel>Report Delivery Date</FormLabel>
                <Input
                  name="reportDeliveryDate"
                  type="date"
                  value={formValues.reportDeliveryDate}
                  onChange={handleInputChange}
                />
            </FormControl>
          </>
        )}

        <Button type="submit" mt={4} colorScheme="blue">
            Submit
        </Button>
      </form>
    </Box>
  );
}
