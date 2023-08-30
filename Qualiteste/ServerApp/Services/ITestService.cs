using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ITestService
    {
        Either<CustomError, TestSuccesses> AddConsumerToTest(string id, IEnumerable<int> consumer);
        Either<CustomError, string> CreateNewTest(TestInputModel testInput);
        Either<CustomError, TestSuccesses> UpdateAttributeAlias(string testId, FizzAliasDto[] alias);
        Either<CustomError, IEnumerable<TestOutputModel>> GetFilteredTestsList(string type);
        Either<CustomError, FizzTableModel> GetFizzTable(string id);
        Either<CustomError, TestPageModel> GetTestById(string id);
        Either<CustomError, IEnumerable<TestOutputModel>> GetTestsList();
        Either<CustomError, TestOutputModel> UpdateTest(string id, TestInputModel testInput);
        Either<CustomError, IEnumerable<TestOutputModel>> GetClientsTests(string clientUsername);
        Either<CustomError, TestPageModel> GetClientsTestByID(string clientUsername, string id);
        Either<CustomError, TestSuccesses> RemoveTestResults(string testId);
    }
}
