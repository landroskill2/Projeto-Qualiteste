using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ITestService
    {
        Either<CustomError, string> CreateNewTest(TestInputModel testInput);
        Either<CustomError, IEnumerable<TestOutputModel>> GetFilteredTestsList(string type);
        Either<CustomError, TestPageModel> GetTestById(string id);
        Either<CustomError, IEnumerable<TestOutputModel>> GetTestsList();
        Either<CustomError, TestOutputModel> UpdateTest(int id, TestInputModel testInput);
    }
}
