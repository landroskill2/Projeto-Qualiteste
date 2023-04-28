using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class TestRepository : Repository<Test>, ITestRepository
    {
        public TestRepository(PostgresContext context) : base(context)
        {
        }

        public IEnumerable<Test> ListTestsByDate()
        {
            return PostgresContext.Tests.OrderByDescending(t => t.Requestdate);
        }

        public Test? GetTestById(string id)
        {
            return PostgresContext.Tests.SingleOrDefault(t => t.Internalid == id);
        }

        public PostgresContext PostgresContext
        {
            get { return Context as PostgresContext; }
        }
    }
}
