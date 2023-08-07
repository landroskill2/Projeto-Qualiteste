using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IProductService
    {
        Either<CustomError, IEnumerable<ProductOutputModel>> GetAllProducts(string? brandName);

        //Mudar para output model de brands
        // - BrandsOutputModel?
        // - IEnumerable<Brand>?
        Either<CustomError, BrandOutputModel> GetAllBrands();

    }
}