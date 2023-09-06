using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
        IEnumerable<Product> QueryProducts(string? brandName, string? designation);

        int GetLastId();
        Product GetProductById(int id);
    }
}
