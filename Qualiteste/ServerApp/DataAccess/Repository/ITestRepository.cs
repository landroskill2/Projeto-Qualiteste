using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ITestRepository : IRepository<Test>
    {
        object GetTestById();
        IEnumerable<Test> ListTestsByDate();
    }
}
