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
    product : number,
    validationDate?: string;
    dueDate?: string;
    reportDeliveryDate?: string;
    samples : ISampleInputModel[];
}

interface ISampleInputModel{
    ProductId : number,
    PresentationPosition : number,
}

export interface IFizzValues {
    columns: Record<string, string>,
    rows: Record<string, string>[]
}
