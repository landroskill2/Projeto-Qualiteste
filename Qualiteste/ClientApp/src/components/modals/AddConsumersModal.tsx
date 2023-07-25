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

//Change received function to use id and sessionTime
type ModalProps = {
    onClickConsumer : (id : number) => void
}

export default function AddConsumersModal({onClickConsumer} : ModalProps) : React.ReactElement {
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [sex, setSex] = useState(null)
    const [maxAge, setMaxAge] = useState<number>(100)
    const [minAge, setMinAge] = useState<number>(0)
    const [sessionTime, setSessionTime] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSessionTimeChange = (event) => setSessionTime(event.target.value)

    useEffect(() => {
        populateData() 
      }, [sex, minAge, maxAge, searchString]);
    
      
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
    return(
        <div>
            <Button
                onClick={onOpen}
                m={4}
                >{`Adicionar Provador`}
            </Button>
            <Modal scrollBehavior='inside'  onClose={onClose} size="5xl" isOpen={isOpen}>
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
                                <div className="mb-10" style={{ position: "sticky", top: "4rem", zIndex: 1 }}>
                                    <Text>Tempo da Sessão</Text>
                                    <Input type="time" onChange={handleSessionTimeChange}></Input>
                                    <FilterBar
                                        setSex={setSex}
                                        setMinAge={setMinAge}
                                        setMaxAge={setMaxAge}
                                        setSearchString={setSearchString}
                                        searchBar
                                    />
                                </div>

                                <div className="mt-10" style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
                                    <ConsumersTable consumers={consumers} onClickConsumer={onClickConsumer}/>
                                </div>
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