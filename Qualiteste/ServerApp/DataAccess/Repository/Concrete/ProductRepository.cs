using Qualiteste.ServerApp.Models;
using System.Linq.Expressions;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {

        public ProductRepository(PostgresContext context) : base(context) { }
        public IEnumerable<Product> QueryProducts(string? brandName, string? designation)
        {
            Expression<Func<Product, bool>> query = p => (brandName == null ? true : p.Brand == brandName)
                                                    && (designation == null ? true : p.Designation.ToLower().Contains(designation.ToLower()));

            return PostgresContext.Products.Where(query);
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
