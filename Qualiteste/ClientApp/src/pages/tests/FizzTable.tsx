import { getFizzTableValues } from '../../common/APICalls';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { IFizzValues } from '../../common/Interfaces/Tests';

export default function FizzResults() : React.ReactElement { 
    const [placeholder, setPlaceholder] = useState(null)
    const { id } = useParams()

    useEffect(()=>{
        populateValues()
    },[])

    async function populateValues(){
        const res = getFizzTableValues(id!)
            .then(res => res.json())
            .then(res => separateValues(res as IFizzValues))
    }

    function separateValues(values: IFizzValues) {
        const commonColumns: Record<string, string> = {};
        const productColumns: Record<string, string>[] = [];
      
        for (const columnName in values.columns) {
          const columnValue = values.columns[columnName];
      
          if (!columnName.startsWith("P2")) {
            commonColumns[columnName] = columnValue;
          } else {
            const productIndex = columnName.indexOf("_");
            const productKey = columnName.slice(0, productIndex + 3);
      
            // Find the corresponding product object or create a new one
            let productObj = productColumns.find((obj) => obj.productKey === productKey);
            if (!productObj) {
              productObj = { productKey };
              productColumns.push(productObj);
            }
      
            // Add the column to the product object
            productObj[columnName] = columnValue;
          }
        }
        
        console.log(commonColumns)
        console.log(productColumns)
      
        return {
          commonColumns,
          productColumns,
        };
      }

    return(<></>);
}