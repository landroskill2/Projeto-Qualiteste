import { IConsumerOutputModel } from "./Consumers"

export interface ISessionOutputModel{
    id: string,
    date: string,
    consumersNumber: Number
}

export interface IConsumerSessionOutputModel {
    consumer: IConsumerOutputModel;
    contactedDate: string | undefined;
    confirmationDate: string | undefined;
    sessionTime: string | undefined;
    attendance: boolean;
    stampDate: string | undefined;
}