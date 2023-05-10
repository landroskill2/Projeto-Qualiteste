import { IConsumerOutputModel } from "./Consumers"

export interface ISessionOutputModel{
    id: string,
    date: string,
    consumersNumber: Number
}

export interface IConsumerSessionOutputModel {
    consumer: IConsumerOutputModel;
    contacteddate: string | undefined;
    confirmationdate: string | undefined;
    sessiontime: string | undefined;
    attendance: boolean;
    stampdate: string | undefined;
}