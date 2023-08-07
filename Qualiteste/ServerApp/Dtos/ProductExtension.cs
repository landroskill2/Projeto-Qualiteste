using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;
public partial class Product
{
    public ProductOutputModel toOutputModel()
    {
        return new ProductOutputModel
        {
            Productid = Productid,
            Brand = Brand,
            Designation = Designation
        };
    }
}

