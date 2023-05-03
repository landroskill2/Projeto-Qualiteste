using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;
using System.Linq.Expressions;

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

        public IEnumerable<Test> ListTestsWithFilters(string type)
        {
            Expression<Func<Test, bool>> typePredicate = t => type.Equals("*") ? true : t.Testtype == type.ToUpper();

            return ListTestsWithFilters(typePredicate);
        }

        public IEnumerable<Test> ListTestsWithFilters(
            Expression<Func<Test, bool>> typeP
            )
        {
            IEnumerable<Test> tests;
            tests = PostgresContext.Tests
                .Where(typeP)
                .OrderByDescending(t => t.Requestdate);
            return tests;
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
