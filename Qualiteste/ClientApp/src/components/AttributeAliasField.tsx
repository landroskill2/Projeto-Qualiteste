import { useState, useEffect } from "react";
import { changeFizzAttributeAlias } from "../common/APICalls";

type Attribute = {
    testId : string
    //attribute alias value
    value : string
    //attribute designation
    name : string
}



export function AttributeAliasField({name, value, testId} : Attribute,) : React.ReactElement {
    const [currAlias, setCurrAlias] = useState(value)
    const [inputValue, setInputValue] = useState(value)

    const updateInputValue= (value : string) => {
        setInputValue(value)
    }
    
    const changeAlias = (recent : string) => {
        //If recent and old have same value, do nothing
        if(recent == currAlias) return 
        changeFizzAttributeAlias(testId,name,recent).then(res => {
            console.log("Alias updated successfully")
            //on success change currentAlias and display saying it went successfully
            setCurrAlias(recent)
        }).catch(err => {
            console.log("Alias failed to update")
             //on error change value on inputField back to the original
            //and toast with error message
            setInputValue(currAlias)
        })
    }
    return (
        <input value = {inputValue} onChange= {e => updateInputValue(e.target.value)} onBlur={ e => changeAlias(inputValue)}></input>
    ) 
}