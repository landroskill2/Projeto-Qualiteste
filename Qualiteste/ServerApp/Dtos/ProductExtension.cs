using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;
public partial class Product
{
    public ProductOutputModel toOutputModel()
    {
        return new ProductOutputModel
        {
            Productid = Productid,
            Ref = Ref,
            Brand = Brand,
            Designation = Designation
        };
    }
}

