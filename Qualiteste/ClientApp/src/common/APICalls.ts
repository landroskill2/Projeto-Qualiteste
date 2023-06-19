import { IConsumerInputModel } from "./Interfaces/Consumers"
import { ISessionModel } from "./Interfaces/Sessions"
import { ITestInputModel } from "./Interfaces/Tests"


//Consumers
export async function fetchConsumers(
    filters: Record<string, string>
) : Promise<Response> {
    let path = "/api/consumers"
    path = addFiltersToQuery(path, filters)
    return fetch(path)
}

export async function fetchConsumerById(id: Number) : Promise<Response> {
    const path = `/api/consumers/${id}`
    return fetch(path)
}

export async function createConsumer(
    consumer: IConsumerInputModel
): Promise<Response> {
    const path = "/api/consumers"
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consumer)
    })
}

//Tests
export async function fetchTests(
    filters: Record<string, string>
) : Promise<Response>{
    let path = "/api/tests"
    path = addFiltersToQuery(path, filters)
    return fetch(path)
}

export async function fetchTestById(
    id : String
) : Promise<Response>{
    let path = `/api/tests/${id}`
    return fetch(path)
}

export async function createTest(
    test : ITestInputModel
) : Promise<Response>{
    let path = `/api/tests`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(test)
    })
}

export async function addConsumerToTest(
    testID : string,
    consumer : number
) : Promise<Response>{
    let path = `/api/tests/${testID}/consumers`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consumer)
    })
}

export async function uploadFile(
    id : String,
    file : File
) : Promise<Response>{
    let path = `/api/tests/${id}/upload`
    
    const formData = new FormData();
    formData.append("csvFile", file);

    return fetch(path, {
        method: "POST",
        body: formData
    })
}

export async function getFizzTableValues(
    id : String
) : Promise<Response>{
    let path = `/api/tests/${id}/fizz`
    return fetch(path)
}

//Sessions
export async function fetchSessions() : Promise<Response>{
    let path = "/api/sessions"
    return fetch(path)
}

export async function createSession(
    session: ISessionModel
) : Promise<Response>{
    let path = `/api/sessions`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(session)
    })
}

export async function fetchSessionById(id: string) : Promise<Response>{
    const path = `/api/sessions/${id}`
    return fetch(path)
}

export async function addTestToSession(
    sessionID: string,
    test : string
) : Promise<Response> {
    let path = `/api/sessions/${sessionID}/tests`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(test)
    })
}

export async function addConsumerToSession(
    sessionID : string,
    consumer : number
) : Promise<Response>{
    let path = `/api/sessions/${sessionID}/consumers`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consumer)
    })
}

// Authentication

export async function loginUser(
    username: string,
    password: string
) : Promise<Response>{
    let path = `/api/accounts/login`
    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    })
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