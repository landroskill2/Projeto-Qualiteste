import { IConsumerInputModel } from "./Interfaces/Consumers"


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