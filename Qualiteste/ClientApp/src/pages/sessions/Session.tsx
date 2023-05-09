import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
} from "@chakra-ui/react";
import { ISessionOutputModel } from '../../common/Interfaces/Sessions'
import { IConsumerSessionOutputModel } from '../../common/Interfaces/Sessions'
import { ITestOutputModel } from "../../common/Interfaces/Tests";
import { fetchSessionById } from '../../common/APICalls';
import { useParams } from "react-router-dom";

export default function Session() : React.ReactElement{
  // State variables to hold the session, consumerSessions, and tests data
  const [session, setSession] = useState<ISessionOutputModel | null>(null);
  const [consumerSessions, setConsumerSessions] = useState<IConsumerSessionOutputModel[]>([]);
  const [tests, setTests] = useState<ITestOutputModel[]>([]);
  const {id} = useParams()

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetchSessionById(id!!).then(res => res.json())
        const { session, consumerSessions, tests } = response;
  
        setSession(session);
        setConsumerSessions(consumerSessions);
        setTests(tests);
      };
  
      fetchData();
  }, []);

  // Helper function to group the consumerSessions by sessionTime
  const groupConsumerSessionsByTime = (): { [key: string]: IConsumerSessionOutputModel[] } => {
    const grouped: { [key: string]: IConsumerSessionOutputModel[] } = {};

    consumerSessions.forEach((consumerSession) => {
      if (grouped[consumerSession.sessionTime ?? ""]) {
        grouped[consumerSession.sessionTime ?? ""].push(consumerSession);
      } else {
        grouped[consumerSession.sessionTime ?? ""] = [consumerSession];
      }
    });

    return grouped;
  };

  // Render the component
  return (
    <>
      {session && (
        <>
          <Heading>{session.id}</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Number of Consumers</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{session.date}</Td>
                <Td>{session.consumersNumber.toString()}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Heading>Consumer Sessions</Heading>
          {Object.entries(groupConsumerSessionsByTime()).map(([sessionTime, consumerSessions]) => (
            <div key={sessionTime}>
              <Heading size="md">{sessionTime}</Heading>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Full Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {consumerSessions.map((consumerSession) => (
                    <Tr key={consumerSession.consumer.id}>
                      <Td>{consumerSession.consumer.fullname}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          ))}
          <Heading>Tests</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Test ID</Th>
                <Th>Type</Th>
                <Th>Number of Consumers</Th>
                <Th>Request Date</Th>
                <Th>Validation Date</Th>
                <Th>Due Date</Th>
                <Th>Report Delivery Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tests.map((test) => (
                <Tr key={test.id}>
                  <Td>{test.id}</Td>
                  <Td>{test.type}</Td>
                  <Td>{test.consumersNumber.toString()}</Td>
                  <Td>{test.requestDate ?? "-"}</Td>
                  <Td>{test.validationDate ?? "-"}</Td>
                  <Td>{test.dueDate ?? "-"}</Td>
                  <Td>{test.reportDeliveryDate ?? "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </>
  );
};
