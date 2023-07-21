import { useState, useEffect } from "react";
import FizzAttribute from "../common/Interfaces/FizzAttributes";

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
        console.log(currAlias)
        console.log(recent)
        //If recent and old have same value, do nothing
        if(recent != currAlias){
            console.log("Alias updated successfully")
            //on success change currentAlias and display saying it went successfully
            addChangedAlias!({name: name, alias: recent} as FizzAttribute)
        }
    }
    return (
        <>
        { editMode && 
            <input value = {inputValue} onChange= {e => updateInputValue(e.target.value)} onBlur={ e => changeAlias(inputValue)}></input> ||
            currAlias
        }
        </>
    ) 
}