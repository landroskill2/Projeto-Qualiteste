import React, { useEffect, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import {
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    FocusLock,
    Button,
    Text,
    Input,
  } from '@chakra-ui/react'

type Params = {
    consumerId : number,
    sessionId : string,
    availableSessionTimes? : string[],
    onSubmit : (sessionId : string, consumerId : number, sessionTime : string) => void
}

export default function SessionTimeSelector({consumerId, sessionId, availableSessionTimes, onSubmit } : Params){
    const [sessionTime, setSessionTime] = useState<string>()
    const { onOpen, onClose, isOpen } = useDisclosure()


    function onCancel(){
        setSessionTime("")
        onClose()
    }

    function onConfirmation(){
        onClose()
        onSubmit(sessionId, consumerId, sessionTime!)
    }

    return (
        <>
            <Popover
             isOpen={isOpen}
             onOpen={onOpen}
             onClose={onCancel}
             placement='bottom'
             closeOnBlur={true}
            >
                <PopoverTrigger>
                    <CheckIcon boxSize="0.9em"/>
                </PopoverTrigger>
                <PopoverContent p={5}>
                    <FocusLock persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text>Hora:</Text>
                        <Input type="time" value={sessionTime} onChange={(e) => setSessionTime(e.target.value)}></Input>
                        <div className="mt-3 flex w-full items-stretch justify-between">
                            <Button colorScheme="red" className="bg-red-500  text-white font-bold py-2 px-4 border-b-4 hover:border-red-600 rounded" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button colorScheme="green" className="bg-green-500  text-white font-bold py-2 px-4 border-b-4 hover:border-green-600 rounded" onClick={onConfirmation}>
                                Confirmar
                            </Button>
                        </div>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        </>
    )
} 