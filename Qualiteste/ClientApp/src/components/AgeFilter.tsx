import React, { useEffect, useState } from "react";

import {
    Text,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    Button,
    FocusLock,
  } from '@chakra-ui/react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
  } from '@chakra-ui/react'

interface Params {
    minAge? : number,
    maxAge? : number,
    setMinAge? : ()=>{},
    setMaxAge? : ()=>{}
}

export default function AgeFilter({
    minAge = 0,
    maxAge = 100,
    setMinAge,
    setMaxAge
} :  Params){
    const [filterText, setFilterText] = useState("Idade")
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [minAgeField, setMinAgeField] = useState(0)
    const [maxAgeField, setMaxAgeField] = useState(100)

    useEffect(() => {
        let str = ""
        if(minAgeField > 0 && maxAgeField < 100){
            str = `${minAgeField}-${maxAgeField}`
        }else if(minAgeField>0 && maxAgeField>=100){
            str = `>${minAgeField}`

        }else if(minAgeField<=0 && maxAgeField < 100){
            str = `<${maxAgeField}`
        }else{
            str = "Idade"
        }
        setFilterText(str)
    }, [minAgeField, maxAgeField])


    function applyFilter(){
        setMinAge(minAgeField)
        setMaxAge(maxAgeField)
        onClose()
    }

    function clearFilter(){
        setMinAgeField(0)
        setMaxAgeField(100)
        setMinAge(0)
        setMaxAge(100)
    }
    return (
        <div>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='bottom'
                closeOnBlur={true}
            >
                <PopoverTrigger>
                    <Button className="capitalize" bgColor={"gray.300"}>{filterText}</Button>
                </PopoverTrigger>
                <PopoverContent p={5} zIndex={"docked"}>
                    <FocusLock persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text>Mínimo:</Text>
                        <NumberInput value={minAgeField} min={0} max={maxAgeField-1} onChange={(_ , valueAsNumber) => setMinAgeField(valueAsNumber)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Text>Máximo:</Text>
                        <NumberInput value={maxAgeField} min={minAgeField+1} max={100} onChange={(_ , valueAsNumber) => setMaxAgeField(valueAsNumber)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <div className="mt-3 flex w-full items-stretch justify-between">
                            <Button colorScheme="green" className="bg-green-500  text-white font-bold py-2 px-4 border-b-4 hover:border-green-600 rounded" onClick={applyFilter}>
                                Confirmar
                            </Button>
                            <Button colorScheme="red" className="bg-red-500  text-white font-bold py-2 px-4 border-b-4 hover:border-red-600 rounded" onClick={clearFilter}>
                                Limpar
                            </Button>
                        </div>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        </div>
    )
}