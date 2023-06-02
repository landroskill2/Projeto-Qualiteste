import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Spinner,
  } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ITestOutputModel } from '../../common/Interfaces/Tests';
import { fetchTests } from '../../common/APICalls';
import TestsTable from '../tables/TestsTable';

type ModalProps = {
    onClickTest : (id : string) => void
}

export default function AddTestsModal({onClickTest} : ModalProps) : React.ReactElement {
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        populateData() 
      }, []);
    
      async function populateData() {
        const filters = { type : "SP" }
      
          const response = await fetchTests(filters).then(res => res.json())
          setTests(response)
      }

    return(
        <>
            <Button
                onClick={onOpen}
                m={4}
                >{`Adicionar Teste`}
            </Button>
            <Modal onClose={onClose} size="full" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicione Testes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {tests === null ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                                <TestsTable tests={tests} onClickTest={onClickTest}/>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}