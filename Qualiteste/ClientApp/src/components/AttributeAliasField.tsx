import { useState, useEffect } from "react";
import FizzAttribute from "../common/Interfaces/FizzAttributes";
import { Input } from "@chakra-ui/react";

type Attribute = {
    //attribute alias value
    value : string
    //attribute designation
    name : string
    editMode : boolean
    addChangedAlias?: (attr: FizzAttribute) => void
}



export function AttributeAliasField({name, value, editMode, addChangedAlias} : Attribute) : React.ReactElement {
    const currAlias = value
    const [inputValue, setInputValue] = useState(value)

    const updateInputValue = (value : string) => {
        setInputValue(value)
    }

    useEffect(() => {
        setInputValue(value)
    },[editMode])
    
    const changeAlias = (recent : string) => {
        //If recent and old have same value, do nothing
        if(recent != currAlias){
            //on success change currentAlias and display saying it went successfully
            addChangedAlias!({name: name, alias: recent} as FizzAttribute)
        }
    }
    return (
        <>
        { editMode && (
            <Input className=" bg-slate-200 rounded-md" value = {inputValue} onChange= {e => updateInputValue(e.target.value)} onBlur={ e => changeAlias(inputValue)}></Input>
        ) || currAlias
            
        }
        </>
    ) 
}