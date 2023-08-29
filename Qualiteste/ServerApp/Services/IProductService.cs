using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IProductService
    {
        Either<CustomError, IEnumerable<ProductOutputModel>> QueryProducts(string? brandName, string? designation);

        //Mudar para output model de brands
        // - BrandsOutputModel?
        // - IEnumerable<Brand>?
        Either<CustomError, BrandOutputModel> GetAllBrands();

        Either<CustomError, ProductSuccesses> CreateNewProduct(ProductInputModel product);

    }
}