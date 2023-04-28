using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ITestService
    {
        Either<CustomError, IEnumerable<TestOutputModel>> GetTestsList();
    }
}
