import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import AgeFilter from "./AgeFilter"
interface Params {
    sex? : string,
    minAge? : number,
    maxAge? : number,
    searchBar? : boolean,
    brands? : string[],
    type? : string,
    setSex? : any,
    setMinAge? : any,
    setMaxAge? : any,
    setBrand? : any,
    setType? : any,
    setSearchString? : any
}

export default function FilterBar({
    sex = "Sexo",
    minAge,
    maxAge,
    searchBar,
    brands = [],
    type = "Ambos",
    setSex,
    setMinAge,
    setMaxAge,
    setBrand,
    setType,
    setSearchString
}: Params) {
    const [dropdownText, setDropdownText] = useState(sex)
    const [searchInputValue, setSearchInputValue] = useState<string>("")
    const [brandDropdownText, setBrandDropdownText] = useState<string>("Marca")
    
    function onClickSearch() {
        setSearchString(searchInputValue)
    }

    function onClickSexDropDown(sex: string | undefined){
        if(sex) {
            setDropdownText(sex)
        }else{
            setDropdownText("Sexo")
        }
        setSex(sex)
    }

    function onClickTypeDropDown(type: string | undefined){
        if(type) {
            setDropdownText(type)
        }else{
            setDropdownText("Ambos")
        }
        setType(type)
    }

    function useSearchBar() {
        if(searchBar){
            return (
                <div className="flex w-full gap-1">
                  <Input
                    className="!bg-white"
                    id="searchBar"
                    type="search"
                    placeholder="Procurar"
                    aria-label="Procurar"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onKeyDown={(e) => { (e.key === "Enter") && onClickSearch(); }}
                  />
                  <IconButton
                    aria-label='Procurar'
                    bgColor={"gray.300"}
                    type="button"
                    icon={<BsSearch />}
                    onClick={() => onClickSearch()}
                  />
                </div>
              );
        }
    }

    function useProductFilters(){
        if(setBrand){
            return (
                <>
                    <Menu>
                        <MenuButton
                            className="capitalize "
                            bgColor={"gray.300"}
                            as={Button}
                            rightIcon={<BsChevronDown/>}
                            >
                            {brandDropdownText}
                        </MenuButton>
                        <MenuList zIndex={"docked"}>
                            {brands && (
                                brands.map((b) => (
                                    <>
                                        <MenuItem
                                           className="capitalize"
                                           onClick={() => {setBrand(b); setBrandDropdownText(b)}}
                                        >
                                            {b}
                                        </MenuItem>
                                    </>   
                                    ))
                                )}
                            <MenuItem
                                className="capitalize"
                                onClick={() => {setBrand(undefined); setBrandDropdownText("Marca")}}
                                >
                                Limpar Filtros
                            </MenuItem>
                        </MenuList>
                    </Menu>  
                </>
            )
        }
    }
    return(
            <div className="w-full flex flex-row justify-between bg-slate-100 p-2 rounded-xl">
                <div className="w-fit flex flex-row gap-3 justify-between">
                    <div id="sex-dropdown" className="flex-1">
                        {setSex && (
                            <Menu>
                                <MenuButton
                                    className="capitalize "
                                    bgColor={"gray.300"}
                                    as={Button}
                                    rightIcon={<BsChevronDown/>}
                                >
                                    {dropdownText}
                                </MenuButton>
                                <MenuList zIndex={"docked"}>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickSexDropDown(undefined)}
                                    >
                                        Ambos
                                    </MenuItem>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickSexDropDown("M")}
                                    >
                                        Masculino
                                    </MenuItem>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickSexDropDown("F")}
                                    >
                                        Feminino
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </div>
                    {setMinAge && setMaxAge && (
                        <>
                        <AgeFilter minAge={minAge} maxAge={maxAge} setMinAge={setMinAge} setMaxAge={setMaxAge}></AgeFilter>
                        </>
                        
                    )}
                    {useProductFilters()}
                </div>
                <div className="flex justify-end flex-shrink">
                    {useSearchBar()}
                </div>
                        
            </div>
    )
}