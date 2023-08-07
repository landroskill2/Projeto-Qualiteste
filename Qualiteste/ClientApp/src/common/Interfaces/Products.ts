export default interface Product {
    brand: string,
    type: "A" | "NA",
    designation: string
}

export interface ProductOutputModel
{
    productid  : number,
    designation : string,
    brand : string
}