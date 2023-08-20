import { Icon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"

type Props = {
    attendance : boolean | undefined,
    onClick : () => void
}

export function CircleIconDiv({attendance, onClick} : Props) : React.ReactElement {
    const [currColor, setCurrColor] = useState("grey")

    const CircleIcon = (props) => (
        <Icon viewBox='0 0 100 200' {...props}>
          <path
            fill='currentColor'
            d='M 50, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
          />
        </Icon>
      )


    useEffect(() => {
        currentColorState()
    }, [])
    

    return (
      <div className="flex hover:bg-slate-300 cursor-pointer justify-center items-center content-center" onClick={onClick} onMouseEnter={() => {nextColorState()}} onMouseLeave={()=>{currentColorState()}}>
        <CircleIcon boxSize={4} className="self-center" color={currColor}></CircleIcon>
      </div>
    )

    function nextColorState() {
        if(attendance != undefined){
            attendance == true ? setCurrColor("red.500") : setCurrColor("green.500")
        }else{
            setCurrColor("green.500")
        }
    }

    function currentColorState() {
        if(attendance != undefined){
            attendance == true ? setCurrColor("green.500") : setCurrColor("red.500")
        }else{
            setCurrColor("grey")
        }
    }
}