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
import FilterBar from '../FilterBar'
import { IConsumerOutputModel } from '../../common/Interfaces/Consumers';
import { fetchConsumers } from '../../common/APICalls';
import ConsumersTable from '../tables/ConsumersTable';

type ModalProps = {
    onClickConsumer : (id : number) => void
}

export default function AddConsumersModal({onClickConsumer} : ModalProps) : React.ReactElement {
    const [consumers, setConsumers] = useState<IConsumerOutputModel[] | null>(null);
    const [sex, setSex] = useState(null)
    const [age, setAge] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        populateData() 
      }, [sex, age, searchString]);
    
      async function populateData() {
        const filters = Object.assign(
          {},
          sex === null ? null : {sex: sex},
          age === null ? null : {age: age},
          searchString === null ? null : {name: searchString}
        )
    
        const response = await fetchConsumers(filters).then(res => res.json())
        setConsumers(response)
      }

    return(
        <>
            <Button
                onClick={onOpen}
                m={4}
                >{`Adicionar Provador`}
            </Button>
            <Modal onClose={onClose} size="full" isOpen={isOpen}>
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
                            <>
                                <div className="mb-10" style={{ position: "sticky", top: "4rem", zIndex: 1 }}>
                                    <FilterBar
                                        setSex={setSex}
                                        setAge={setAge}
                                        setSearchString={setSearchString}
                                        searchBar
                                    />
                                </div>

                                <div className="mt-10" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                                    <ConsumersTable consumers={consumers} onClickConsumer={onClickConsumer}/>
                                </div>
                            </>
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