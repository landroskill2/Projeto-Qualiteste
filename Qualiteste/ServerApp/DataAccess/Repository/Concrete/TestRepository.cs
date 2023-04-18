using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class TestRepository : Repository<Test>, ITestRepository
    {
        public TestRepository(PostgresContext context) : base(context)
        {
        }
    }
}
