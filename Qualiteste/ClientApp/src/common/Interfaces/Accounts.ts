export default interface IAccountOutput {
    username: string,
    password: string,
    role: "ADMIN" | "CLIENT",
    id? : string,
    designation? : string
}