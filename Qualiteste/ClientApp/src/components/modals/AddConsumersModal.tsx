import {
    Text,
    Input,
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
import FilterBar from '../FilterBar'
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { fetchConsumers } from '../../common/APICalls';
import ConsumersTable from '../tables/ConsumersTable';
import InfiniteScroll from 'react-infinite-scroll-component';

//Change received function to use id and sessionTime
type ModalProps = {
    onSubmit : (ids : number[]) => void
}

export default function AddConsumersModal({onSubmit} : ModalProps) : React.ReactElement {
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [shownConsumers, setShownConsumers] = useState<IConsumerOutputModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentIdx, setCurrentIdx] = useState(20)
    const [sex, setSex] = useState(null)
    const [maxAge, setMaxAge] = useState<number>(100)
    const [minAge, setMinAge] = useState<number>(0)
    const [sessionTime, setSessionTime] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const [selectedConsumers, setSelectedConsumers] = useState<number[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSessionTimeChange = (event) => setSessionTime(event.target.value)

    useEffect(() => {
        populateData() 
    }, [sex, minAge, maxAge, searchString]);
    
    useEffect(() => {
        if(consumers != null){
          setShownConsumers(consumers!.slice(0, currentIdx))
        }
        
      },[consumers])


    function updateShownConsumers()
    {
        let nextIdx = currentIdx + 20 > consumers!.length ? consumers!.length : currentIdx + 20
        const consumersToAdd = consumers!.slice(currentIdx, nextIdx)
        setShownConsumers((prevItems) => [...prevItems, ...consumersToAdd] )
        setCurrentIdx(nextIdx)
    }

    async function populateData() {
        const filters = Object.assign(
            {},
            sex === null ? null : {sex: sex},
            minAge === null ? null : {minAge: minAge},
            maxAge === null ? null : {maxAge: maxAge},
            searchString === null ? null : {name: searchString}
        )
    
        const response = await fetchConsumers(filters)
        setConsumers(response.data)
    }

    function updateSelectedConsumers(consumerId : number) {
        if(selectedConsumers.includes(consumerId)){
            setSelectedConsumers((prevSelected) => prevSelected.filter(item => item != consumerId))
        }else{
            setSelectedConsumers((prevSelected) => [...prevSelected, consumerId])
        }
    }

    function onComplete(){
        onSubmit(selectedConsumers)
        setSelectedConsumers([])
        onClose()
    }

    function onModalClose(){
        setSelectedConsumers([])
        onClose()
    }
    
    return(
        <div>
            <Button
                onClick={onOpen}
                m={4}
                bgColor={"gray.300"}
                >{`Adicionar Provadores`}
            </Button>
            <Modal scrollBehavior='inside'  onClose={onModalClose} size="5xl" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicione provadores</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {consumers === null ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className='flex flex-col'>
                                <div className="mb-5" style={{ position: "sticky", top: "1rem", zIndex: 1 }}>
                                    <FilterBar
                                        setSex={setSex}
                                        setMinAge={setMinAge}
                                        setMaxAge={setMaxAge}
                                        setSearchString={setSearchString}
                                        searchBar
                                    />
                                </div>

                                <div className="mt-10" style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
                                    <InfiniteScroll
                                        dataLength={shownConsumers.length}
                                        next={updateShownConsumers}
                                        hasMore={shownConsumers.length != consumers.length}
                                        loader={<div className="flex w-full justify-center items-center"><Spinner/></div>}
                                        endMessage={<></>}
                                        height={'calc(100vh - 400px)'}
                                        className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-lg"
                                        >
                                        <ConsumersTable selectedConsumers={selectedConsumers} consumers={shownConsumers} onClickConsumer={updateSelectedConsumers}/>
                                    </InfiniteScroll>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <div className='flex gap-4'>
                            <Button onClick={onModalClose}>Fechar</Button>
                            <Button onClick={onComplete}>Adicionar Consumidores</Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}