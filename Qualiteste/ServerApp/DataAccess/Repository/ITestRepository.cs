using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ITestRepository : IRepository<Test>
    {
        Test? GetTestById(string id);
        IEnumerable<Test> ListTestsByDate();
        IEnumerable<Test> ListTestsWithFilters(string type);
    }
}
