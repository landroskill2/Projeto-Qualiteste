using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
        IEnumerable<Product> GetAllProducts(string? brandName);

        //No need for GetAllBrands operation in repository
    }
}
