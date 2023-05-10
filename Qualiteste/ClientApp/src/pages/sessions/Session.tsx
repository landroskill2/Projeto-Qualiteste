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
import { IConsumerOutputModel } from "../../common/Interfaces/Consumers";

export default function Session() : React.ReactElement{
  // State variables to hold the session, consumerSessions, and tests data
  const [session, setSession] = useState<ISessionOutputModel | null>(null);
  const [consumerSessions, setConsumerSessions] = useState<IConsumerSessionOutputModel[]>([]);
  const [tests, setTests] = useState<ITestOutputModel[]>([]);
  const {id} = useParams()

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetchSessionById(id!!).then(res => res.json())
        const { session, consumers, tests } = response;
  
        setSession(session);
        setConsumerSessions(consumers);
        setTests(tests);
      };
  
      fetchData();
  }, []);

  // Helper function to group the consumerSessions by sessionTime
  const groupConsumerSessionsByTime = (): { sessionTime: string, consumers: IConsumerOutputModel[] }[] => {
    const grouped: { [key: string]: IConsumerOutputModel[] } = {};
    if (consumerSessions) {
      consumerSessions.forEach((consumerSession) => {
        if (grouped[consumerSession.sessiontime!!]) {
          grouped[consumerSession.sessiontime!!].push(consumerSession.consumer);
        } else {
          grouped[consumerSession.sessiontime!!] = [consumerSession.consumer];
        }
      });
    }

    // convert the grouped object to an array of objects with sessionTime and consumers properties
    const result = [];
    for (const [sessionTime, consumers] of Object.entries(grouped)) {
      result.push({ sessionTime, consumers });
    }

    return result;
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
          <Table variant="simple">
            <Thead>
              <Tr>
                {groupConsumerSessionsByTime().map(({ sessionTime }) => (
                  <Th key={sessionTime}>{sessionTime}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {groupConsumerSessionsByTime().map(({ consumers }) => (
                  <Td key={consumers[0].id}>
                    {consumers.map((consumer) => (
                      <Tr key={consumer.id}>
                        <Td className="hover:bg-slate-200 cursor-pointer">{consumer.fullname}</Td>
                      </Tr>
                    ))}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
          <Heading>Tests</Heading>
            <Table>
              <Thead>
                <Tr>
                  <Th>Test ID</Th>
                  <Th>Type</Th>
                  <Th>Number of Consumers</Th>
                  <Th>Request Date</Th>
                </Tr>
              </Thead>
            <Tbody>
              {tests.map((test) => (
                <Tr className="hover:bg-slate-200 cursor-pointer" key={test.id}>
                  <Td>{test.id}</Td>
                  <Td>{test.type}</Td>
                  <Td>{test.consumersNumber.toString()}</Td>
                  <Td>{test.requestDate ?? "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </>
  );
}
