import * as jose from "jose"
import IAccountOutput from "../common/Interfaces/Accounts"


export default function GetAccount(): IAccountOutput | undefined {
    const token = localStorage.getItem("QualitesteToken")
    if(!token) return undefined
    let decodedToken = jose.decodeJwt(token)
    //console.log(decodedToken)
    if(decodedToken!.exp! * 1000 < new Date().getTime()) return undefined
    return {
        username: decodedToken.username as string,
        role: decodedToken.role as string
    }
}