export interface IConsumerOutputModel {
    id: number;
    fullname: string;
    age: string;
    sex: string;
    contact: number;
    email?: string | null;
  }

export interface IConsumerInputModel {
    fullname: string;
    nif: string;
    sex: string,
    dateofbirth: Date | undefined;
    contact: number;
    email?: string
}