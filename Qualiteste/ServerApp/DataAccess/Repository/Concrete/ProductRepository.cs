using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {

        public ProductRepository(PostgresContext context) : base(context) { }
        public IEnumerable<Product> GetAllProducts(string? brandName)
        {
            if (brandName != null) return PostgresContext.Products.Where(p => p.Brand.ToLower() == brandName.ToLower());
            return PostgresContext.Products.AsEnumerable();
        }

        public int GetLastId()
        {
            return PostgresContext.Products.Max(c => c.Productid);
        }

        public PostgresContext PostgresContext
        {
            get { return Context as PostgresContext; }
        }
    }
}
