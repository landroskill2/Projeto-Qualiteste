using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ITestRepository : IRepository<Test>
    {
        IEnumerable<Consumer> GetConsumersInTest(string id);
        Test? GetTestById(string id);
        IEnumerable<Test> ListTestsByDate();
        IEnumerable<Test> ListTestsWithFilters(string type);

    }
}
