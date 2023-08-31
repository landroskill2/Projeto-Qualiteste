import axios, { AxiosInstance, AxiosResponse } from "axios"
import { IConsumerInputModel } from "./Interfaces/Consumers"
import { ISessionModel } from "./Interfaces/Sessions"
import { ITestInputModel } from "./Interfaces/Tests"
import FizzAttribute from "./Interfaces/FizzAttributes"
import IAccountOutput from "./Interfaces/Accounts"
import { ProductInputModel } from "./Interfaces/Products"


const instance: AxiosInstance = localStorage.getItem("QualitesteToken") ?
 axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("QualitesteToken")}`
    }
}) :
 axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    }
 })



export function changeInstanceToken() {
    instance.defaults.headers["Authorization"] = `Bearer ${localStorage.getItem("QualitesteToken")}`
}

//Consumers
export async function fetchConsumers(
    filters: Record<string, string>
) : Promise<AxiosResponse> {
    let path = "/consumers"
    path = addFiltersToQuery(path, filters)
    return instance.get(path)
}

export async function fetchConsumerById(id: Number) : Promise<AxiosResponse> {
    const path = `/consumers/${id}`
    return instance.get(path)
}

export async function createConsumer(
    consumer: IConsumerInputModel
): Promise<AxiosResponse> {
    const path = "/consumers"
    return instance.post(path, consumer)
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(consumer)
    // })
}

//Tests
export async function fetchTests(
    filters: Record<string, string>
) : Promise<AxiosResponse>{
    let path = "/tests"
    path = addFiltersToQuery(path, filters)
    return instance.get(path)
}

export async function fetchClientsTests(
) : Promise<AxiosResponse>{
    let path = `/client/tests`
    return instance.get(path)
}

export async function fetchAllClients() : Promise<AxiosResponse> {
    let path = `/clients`
    return instance.get(path)
}
export async function fetchClientTestById(
    id: String
) : Promise<AxiosResponse>{
    let path = `client/tests/${id}`
    return instance.get(path)
}

export async function fetchTestById(
    id : String
) : Promise<AxiosResponse>{
    let path = `/tests/${id}`
    return instance.get(path)
    //return fetch(path)
}

export async function createTest(
    test : ITestInputModel
) : Promise<AxiosResponse>{
    let path = `/tests`
    return instance.post(path, test)
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(test)
    // })
}

export async function addConsumerToTest(
    testID : string,
    consumers : number[]
) : Promise<AxiosResponse>{
    let path = `/tests/${testID}/consumers`
    return instance.post(path, consumers)

    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(consumer)
    // })
}

export async function uploadFile(
    id : String,
    file : File
) : Promise<AxiosResponse>{
    let path = `/tests/${id}/upload`
    const formData = new FormData();
    formData.append("csvFile", file);
    return instance.post(path, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    // return fetch(path, {
    //     method: "POST",
    //     body: formData
    // })
}

export async function removeResultsFromTest(id: string) : Promise<AxiosResponse> {
    let path = `/tests/${id}/fizz/remove`
    return instance.get(path)
}

export async function getFizzTableValues(
    id : String
) : Promise<AxiosResponse>{
    let path = `/tests/${id}/fizz`
    return instance.get(path)
    //return fetch(path)
}

export async function changeFizzAttributesAlias(
    testId : string,
    attributes: FizzAttribute[]
    ) : Promise<AxiosResponse>{
       const path = `/tests/${testId}/fizz`
       return instance.post(path, JSON.stringify(attributes))
}

//Sessions
export async function fetchSessions() : Promise<AxiosResponse>{
    let path = "/sessions"
    return instance.get(path)
    //return fetch(path)
}

export async function createSession(
    session: ISessionModel
) : Promise<AxiosResponse>{
    let path = `/sessions`
    return instance.post(path, session)
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(session)
    // })
}

export async function fetchSessionById(id: string) : Promise<AxiosResponse>{
    const path = `/sessions/${id}`
    return instance.get(path)
    //return fetch(path)
}

export async function addTestToSession(
    sessionID: string,
    test : string
) : Promise<AxiosResponse> {
    let path = `/sessions/${sessionID}/tests`
    return instance.post(path, JSON.stringify(test))

    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(test)
    // })
}

export async function removeNotConfirmedConsumers(
    sessionID : string,
    selection : string | number
) : Promise<AxiosResponse>{
    let path = `sessions/${sessionID}/consumers?selection=${selection}`
    return instance.delete(path)
}

export async function confirmConsumerSession(
    sessionID : string,
    consumerId : number,
    sessionTime : string
){
    let path = `/sessions/${sessionID}/consumers/${consumerId}/time`
    return instance.put(path, {sessionTime : sessionTime})
}

export async function addConsumerToSession(
    sessionID : string,
    consumers : number[]
) : Promise<AxiosResponse>{
    let path = `/sessions/${sessionID}/consumers`
    
    return instance.post(path, { consumers : consumers})
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(consumer)
    // })
}

export async function updateConsumerAttendance(
    sessionID: string,
    consumerId : number,
    attendance : boolean
) : Promise<AxiosResponse>{
    let path = `/sessions/${sessionID}/consumers/${consumerId}/attendance`
    
    return instance.put(path, { Attendance : attendance})
}

// Authentication

export async function loginUser(
    username: string,
    password: string
) : Promise<AxiosResponse>{
    let path = `/accounts/login`
    return instance.post(path, {username, password})
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password })
    // })
}

export async function registerUser(
    user: IAccountOutput
) : Promise<AxiosResponse>{
    let path = "/accounts/register"
    return instance.post(path, user)
}

function addFiltersToQuery(
    path: string,
    filters: Record<string, string>
): string {
    let size = Object.keys(filters).length
    if(size > 0){
        let i = 1
        path = path.concat("?")
        Object.keys(filters).forEach((key) => {
            if(filters[key] != null) {
                path = path.concat(`${key}=${filters[key]}`)
            }
            if(i < size) path = path.concat("&")
            i++
        })
    }
    return path
}

//Products
export function getAvailableBrands() : Promise<AxiosResponse>{
    let path = `/products/brands`
    return instance.get(path)
}

export function queryProducts(filters : Record<string, string>) : Promise<AxiosResponse>{
    let path = addFiltersToQuery(`/products`, filters)
    return instance.get(path)
}

export function createProduct(product : ProductInputModel){
    let path = `/products`
    return instance.post(path,product)
}

// Accounts

export function fetchAccounts(){
    let path = `/accounts`
    return instance.get(path)
}

export function deleteAccount(username : string) : Promise<AxiosResponse>{
    let path = `/accounts/delete?username=${username}`
    return instance.delete(path)
}
