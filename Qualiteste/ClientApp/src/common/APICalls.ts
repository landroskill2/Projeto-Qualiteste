import axios, { AxiosInstance, AxiosResponse } from "axios"
import { IConsumerInputModel } from "./Interfaces/Consumers"
import { ISessionModel } from "./Interfaces/Sessions"
import { ITestInputModel } from "./Interfaces/Tests"
import FizzAttribute from "./Interfaces/FizzAttributes"


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
    //return fetch(path)
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
    consumer : number
) : Promise<AxiosResponse>{
    let path = `/tests/${testID}/consumers`
    return instance.post(path, consumer)

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

export async function getFizzTableValues(
    id : String
) : Promise<AxiosResponse>{
    let path = `/tests/${id}/fizz`
    return instance.get(path)
    //return fetch(path)
}

//TODO
//IS Boolean to test stuff
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

export async function addConsumerToSession(
    sessionID : string,
    consumer : number
) : Promise<AxiosResponse>{
    let path = `/sessions/${sessionID}/consumers`
    return instance.post(path, consumer)
    // return fetch(path, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(consumer)
    // })
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