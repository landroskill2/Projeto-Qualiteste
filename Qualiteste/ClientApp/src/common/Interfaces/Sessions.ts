import { IConsumerOutputModel } from "./Consumers"

export interface ISessionModel{
    id: string,
    date: string,
    consumersNumber: number
}

export interface IConsumerSessionOutputModel {
    consumer: IConsumerOutputModel;
    contacteddate: string | undefined;
    confirmationdate: string | undefined;
    sessiontime: string | undefined;
    attendance: boolean;
    stampdate: string | undefined;
}