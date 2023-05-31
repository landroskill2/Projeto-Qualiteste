import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { ISessionModel } from "../../common/Interfaces/Sessions";
import { createSession } from "../../common/APICalls";

const initialSession: ISessionModel = {
  id: "",
  date: "",
  consumersNumber: 0,
};

export default function SessionCreation(): React.ReactElement {
  const [session, setSession] = useState<ISessionModel>(initialSession);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "consumersNumber") {
      const parsedValue = parseInt(value, 10);
      const newValue = parsedValue >= 0 ? parsedValue : 0;

      setSession((prevSession) => ({
        ...prevSession,
        [name]: newValue,
      }));
    } else {
      setSession((prevSession) => ({
        ...prevSession,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSession(session)
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl id="id" isRequired>
          <FormLabel>ID</FormLabel>
          <Input
            name="id"
            type="text"
            value={session.id}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl id="date" isRequired>
          <FormLabel>Date</FormLabel>
          <Input
            name="date"
            type="date"
            value={session.date}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl id="consumersNumber" isRequired>
          <FormLabel>Consumers Number</FormLabel>
          <Input
            name="consumersNumber"
            type="number"
            min={0}
            value={session.consumersNumber}
            onChange={handleInputChange}
          />
        </FormControl>

        <Button type="submit" mt={4} colorScheme="blue">
          Submit
        </Button>
      </form>
    </Box>
  );
};