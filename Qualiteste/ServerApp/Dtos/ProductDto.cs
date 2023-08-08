using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record ProductOutputModel
    {
        public int Productid { get; init; }
        public string Ref{ get; init; }
        public string Designation { get; init; }
        public string Brand { get; init; }
    }

    public record BrandOutputModel
    {
        public IEnumerable<string> brands { get; init; }
    }


    public record ProductInputModel
    {
        public string Designation { get; init; }
        public string Brand { get; init; }

        public string Ref {get; init;}


        //must provide id 
        public Product toDbModel(int pid)
        {
            return new Product {
                Productid = pid,
                Ref = Ref,
                Designation = Designation,
                Brand = Brand
            };
        }
    }
}
