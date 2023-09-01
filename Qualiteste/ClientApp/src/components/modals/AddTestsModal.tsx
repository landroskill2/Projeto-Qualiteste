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
import InfiniteScroll from 'react-infinite-scroll-component';

type ModalProps = {
    onClickTest : (id : string) => void
}

export default function AddTestsModal({onClickTest} : ModalProps) : React.ReactElement {
    const [tests, setTests] = useState<ITestOutputModel[] | null>(null);
    const [shownTests, setShownTests] = useState<ITestOutputModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentIdx, setCurrentIdx] = useState(20)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        populateData() 
      }, []);

    useEffect(() => {
        if(tests != null){
            setShownTests(tests!.slice(0, currentIdx))
        }
    },[tests])

    function updateShownTests()
    {
        let nextIdx = currentIdx + 20 > tests!.length ? tests!.length : currentIdx + 20
        const testsToAdd = tests!.slice(currentIdx, nextIdx)
        setShownTests((prevItems) => [...prevItems, ...testsToAdd] )
        setCurrentIdx(nextIdx)
    }


    
    async function populateData() {
        const filters = { type : "SP" }
      
        const response = await fetchTests(filters)
        setTests(response.data)
    }

    return(
        <div className='h-fit'>
            <Button
                onClick={onOpen}
                m={4}
                bgColor={"gray.300"}
                >{`Adicionar Teste`}
            </Button>
            <Modal onClose={onClose} size="5xl" isOpen={isOpen}>
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
                                <InfiniteScroll
                                    dataLength={shownTests.length}
                                    next={updateShownTests}
                                    hasMore={shownTests.length != tests.length}
                                    loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
                                    endMessage={<></>}
                                    height={560}
                                    className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
                                >
                                    <TestsTable tests={shownTests} onClickTest={onClickTest}/>
                                </InfiniteScroll>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}