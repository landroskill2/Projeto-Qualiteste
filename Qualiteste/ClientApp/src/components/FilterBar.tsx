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
    setSex? : any,
    setMinAge? : any,
    setMaxAge? : any,
    setSearchString? : any
}

export default function FilterBar({
    sex = "Sexo",
    minAge,
    maxAge,
    searchBar,
    setSex,
    setMinAge,
    setMaxAge,
    setSearchString
}: Params) {
    const [dropdownText, setDropdownText] = useState(sex)
    const [searchInputValue, setSearchInputValue] = useState<string>("")
    
    function onClickSearch() {
        setSearchString(searchInputValue)
    }

    function onClickDropDownItem(sex: string | undefined){
        if(sex) {
            setDropdownText(sex)
        }else{
            setDropdownText("Sexo")
        }
        setSex(sex)
    }

    function useSearchBar() {
        if(searchBar){
            return (
                <div className="flex w-full">
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
                    colorScheme="blue"
                    type="button"
                    icon={<BsSearch />}
                    onClick={() => onClickSearch()}
                  />
                </div>
              );
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
                                    colorScheme="blue"
                                    as={Button}
                                    rightIcon={<BsChevronDown/>}
                                >
                                    {dropdownText}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickDropDownItem(undefined)}
                                    >
                                        Ambos
                                    </MenuItem>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickDropDownItem("M")}
                                    >
                                        Masculino
                                    </MenuItem>
                                    <MenuItem
                                        className="capitalize"
                                        onClick={() => onClickDropDownItem("F")}
                                    >
                                        Feminino
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </div>
                    <AgeFilter minAge={minAge} maxAge={maxAge} setMinAge={setMinAge} setMaxAge={setMaxAge}></AgeFilter>
                </div>
                <div className="flex justify-end flex-shrink">
                    {useSearchBar()}
                </div>
                        
            </div>
    )
}