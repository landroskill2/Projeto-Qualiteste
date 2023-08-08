export default interface Product {
    brand: string,
    type: "A" | "NA",
    designation: string
}

export interface ProductOutputModel
{
    productid  : number,
    ref : string,
    designation : string,
    brand : string
}
export interface ProductInputModel
{
    ref  : string,
    designation : string,
    brand : string
}