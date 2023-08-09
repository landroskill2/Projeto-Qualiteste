using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ITestService
    {
        Either<CustomError, TestSucesses> AddConsumerToTest(string id, IEnumerable<int> consumer);
        Either<CustomError, string> CreateNewTest(TestInputModel testInput);
        Either<CustomError, TestSucesses> UpdateAttributeAlias(string testId, FizzAliasDto[] alias);
        Either<CustomError, IEnumerable<TestOutputModel>> GetFilteredTestsList(string type);
        Either<CustomError, FizzTableModel> GetFizzTable(int id);
        Either<CustomError, TestPageModel> GetTestById(string id);
        Either<CustomError, IEnumerable<TestOutputModel>> GetTestsList();
        Either<CustomError, TestOutputModel> UpdateTest(int id, TestInputModel testInput);
    }
}
