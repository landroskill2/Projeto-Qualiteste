export interface ITestOutputModel {
    id: string,
    type: string,
    consumersNumber: Number,
    requestDate: string | undefined,
    validationDate?: string | undefined,
    dueDate?: string | undefined,
    reportDeliveryDate?: string | undefined
}