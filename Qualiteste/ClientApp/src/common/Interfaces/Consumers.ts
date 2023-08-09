export interface IConsumerOutputModel {
    id: number;
    fullname: string;
    age: string;
    sex: string;
    contact: number;
    email?: string | null;
  }

export interface IConsumerInputModel {
    id? : number;
    fullname: string;
    nif: string;
    sex: "M" | "F";
    dateofbirth: string;
    contact: number | null;
    email?: string
}