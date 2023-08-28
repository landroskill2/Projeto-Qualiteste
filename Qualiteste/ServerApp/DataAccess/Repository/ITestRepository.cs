using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ITestRepository : IRepository<Test>
    {
        IEnumerable<Consumer>? GetConsumersInTest(string id);
        Test? GetTestById(string id);
        IEnumerable<Test> ListTestsByDate();
        IEnumerable<Test> ListTestsWithFilters(string type);
        void AddFizzAttribute(FizzAttribute fizzAttribute);
       
        IEnumerable<FizzAttribute> GetAttributesInTest(string id);

        void AddAliasToFizzAttribute(string testId, FizzAliasDto[] alias);
        void AddAttributeValue(AttributeValue attributeValue);
        Dictionary<string, string> GetFizzColumns(string id);
        IEnumerable<IGrouping<int, AttributeValue>> GetFizzValuesGroupedByConsumer(string id);
        void AddConsumerToTest(string id, IEnumerable<int> consumer);
        IEnumerable<Test> GetTestsByClient(string clientID);
        Test? GetClientTestsByID(string clientID, string id);
        bool HasResults(string id);
    }
}
