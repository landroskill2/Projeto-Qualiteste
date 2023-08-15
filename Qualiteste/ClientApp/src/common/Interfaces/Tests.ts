export interface ITestOutputModel {
    id: string,
    type: string,
    consumersNumber: Number,
    requestDate: string | undefined,
    validationDate?: string | undefined,
    dueDate?: string | undefined,
    reportDeliveryDate?: string | undefined
}

export interface ITestInputModel{
    id: string;
    testType: "SP" | "HT";
    consumersNumber: number;
    requestDate: string;
    product : number | undefined,
    clientId : string | undefined
    validationDate?: string;
    dueDate?: string;
    reportDeliveryDate?: string;
    samples : ISampleInputModel[];
}

export interface ISampleInputModel{
    ProductId : number,
    PresentationPosition : number,
}

export interface IFizzValues {
    columns: Record<string, string>,
    rows: Record<string, string>[]
}
