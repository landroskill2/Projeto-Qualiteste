using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Either<CustomError, ProductSuccesses> CreateNewProduct(ProductInputModel product)
        {
            try
            {
                int pid = _unitOfWork.Products.GetLastId() + 1;
                Product newP = product.toDbModel(pid);
                
                _unitOfWork.Products.Add(newP);
                _unitOfWork.Complete();
                return new ProductSuccesses.CreateProductSuccess();
            }catch (Exception ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if(state.Equals("23505") && constraint.Equals("product_ref_key"))
                    {
                        return new ProductErrors.ProductWithRefAlreadyPresent();
                    }
                }
                throw ex;
            }
        }

        public Either<CustomError, BrandOutputModel> GetAllBrands()
        {
            try
            {
                IEnumerable<Product> ps = _unitOfWork.Products.GetAllProducts(null);
                IEnumerable<string> brands = ps.Select(p => p.Brand!).Distinct();
                return new BrandOutputModel
                {
                    brands = brands
                };
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public Either<CustomError, IEnumerable<ProductOutputModel>> GetAllProducts(string? brandName)
        {
            try
            {
                return _unitOfWork.Products.GetAllProducts(brandName).Select(p => p.toOutputModel()).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
