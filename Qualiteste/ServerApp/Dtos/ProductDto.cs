using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record ProductOutputModel
    {
        public int Productid { get; init; }
        public string Designation { get; init; }
        public string Brand { get; init; }
    }

    public record BrandOutputModel
    {
        public IEnumerable<string> brands { get; init; }
    }

    //Something is weird here, why OutputModel and InputModel is the same

    public record ProductInputModel
    {
        public int Productid { get; init;}
        public string Designation { get; init; }
        public string Brand { get; init; }

        public Product toDbModel()
        {
            return new Product {
                Productid = Productid,
                Designation = Designation,
                Brand = Brand
            };
        }
    }
}
