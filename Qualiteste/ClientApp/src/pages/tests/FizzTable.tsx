import { getFizzTableValues } from '../../common/APICalls';
import { useNavigate, useParams } from 'react-router-dom';
import React from "react";
import { useEffect, useState } from "react";
import { IFizzValues } from '../../common/Interfaces/Tests';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export default function FizzResults(): React.ReactElement {
  const [data, setData] = useState<IFizzValues | null>(null);
  const [commonColumns, setCommonColumns] = useState<Record<string, string>>({});
  const [productColumns, setProductColumns] = useState<Record<string, string>[]>([]);
  const [textHeight, setTextHeight] = useState<number>(0);

  const { id } = useParams();

  useEffect(() => {
    populateValues();
  }, []);

  async function populateValues() {
    const res = await getFizzTableValues(id!);
    const jsonData = res.data
    setData(jsonData as IFizzValues);
    separateValues(jsonData as IFizzValues);
  }

  function separateValues(values: IFizzValues) {
    const newCommonColumns: Record<string, string> = {};
    const newProductColumns: Record<string, string>[] = [];

    for (const columnName in values.columns) {
      const columnValue = values.columns[columnName];

      if (!columnName.startsWith("P2")) {
        newCommonColumns[columnName] = columnValue;
      } else {
        const productIndex = columnName.indexOf("_");
        const productKey = columnName.slice(0, productIndex + 3);

        // Find the corresponding product object or create a new one
        let productObj = newProductColumns.find((obj) => obj.productKey === productKey);
        if (!productObj) {
          productObj = { productKey };
          newProductColumns.push(productObj);
        }

        // Add the column to the product object
        productObj[columnName] = columnValue;
      }
    }

    setCommonColumns(newCommonColumns);
    setProductColumns(newProductColumns);

    console.log(newCommonColumns);
    console.log(newProductColumns);
  }

  console.log(data);

  return (
    <Box display="flex">
      <Box flex="1" maxWidth="50%" overflowX="auto" marginRight="10px">
        {data && (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                {Object.entries(commonColumns).map(([columnName, columnValue]) => (
                  <Th key={columnName}>{columnValue}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.rows.map((row, index) => (
                <Tr key={index}>
                  {Object.entries(commonColumns).map(([columnName, _]) => (
                    <Td key={columnName}>{row[columnName]}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Box flex="1" maxWidth="50%" overflowX="auto">
        {productColumns.map((product, index) => (
          <Box key={product.productKey} marginBottom="20px">
            <h3>{`Product ${index + 1}`}</h3>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {Object.entries(product).map(([columnName, columnValue]) => {
                    if (columnName !== "productKey") {
                      return <Th key={columnName}>{columnValue}</Th>;
                    }
                    return null;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {data?.rows.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {Object.entries(product).map(([columnName, _]) => {
                      if (columnName !== "productKey") {
                        return <Td key={columnName}>{row[columnName]}</Td>;
                      }
                      return null;
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ))}
      </Box>
    </Box>
  );
}