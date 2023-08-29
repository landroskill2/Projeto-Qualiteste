using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using System;
using System.Linq;
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

            IEnumerable<Test> tests;
            tests = PostgresContext.Tests
                .Where(typePredicate)
                .OrderByDescending(t => t.Requestdate);
            return tests;
        }


        public Test? GetTestById(string id)
        {
            return PostgresContext.Tests.SingleOrDefault(t => t.Internalid == id);
        }

        public IEnumerable<Consumer>? GetConsumersInTest(string id)
        {
            Test? targetTest = GetTestById(id);
            if (targetTest == null)
                return null;
            if (targetTest.Testtype.Equals("HT")) return targetTest.ConsumerHts.Select(c => c.Consumer);
            else return targetTest.Session?.ConsumerSessions.Select(cs => cs.Consumer);

        }
        public IEnumerable<FizzAttribute> GetAttributesInTest(string id)
        {
            return PostgresContext.FizzAttributes.Where(attr => attr.Testid == id);
        }
        public void AddFizzAttribute(FizzAttribute fizzAttribute)
        {
            PostgresContext.FizzAttributes.Add(fizzAttribute);
        }

        public void AddAliasToFizzAttribute(string testId, FizzAliasDto[] alias)
        {

            IEnumerable<FizzAttribute> attrs = alias.Select(a => a.toDbAttribute(testId));
            PostgresContext.FizzAttributes.UpdateRange(attrs);
        }
        public void AddAttributeValue(AttributeValue attributeValue)
        {
            PostgresContext.AttributeValues.Add(attributeValue);
        }




        public void AddConsumerToTest(string id, IEnumerable<int> consumers)
        {
            IEnumerable<ConsumerHt> cHT = consumers.Select(cid => new ConsumerHt { Testid = id, Consumerid = cid });
            foreach(ConsumerHt c in cHT)
            {
                GetTestById(id)?.ConsumerHts.Add(c);
            }
        }

        public Dictionary<string, string> GetFizzColumns(string id)
        {
            return PostgresContext.FizzAttributes.Where(c => c.Testid == id.ToString()).ToDictionary(c => c.Attribute, c=> ReturnAliasIfNotNull(c));
        }
       
        public IEnumerable<IGrouping<int, AttributeValue>> GetFizzValuesGroupedByConsumer(string id)
        { 
            return PostgresContext.AttributeValues.Where(attr => attr.Testid == id.ToString()).GroupBy(attr => attr.Consumerid);
        }

        private string ReturnAliasIfNotNull(FizzAttribute attr)
        {
            return attr.Alias != null ? attr.Alias : attr.Attribute;
        }

        public IEnumerable<Test> GetTestsByClient(string clientID)
        {
            return PostgresContext.Tests.Where(c => c.Clientid == clientID).OrderByDescending(t => t.Requestdate);
        }

        public Test? GetClientTestsByID(string clientID, string id)
        {
            return PostgresContext.Tests.SingleOrDefault(c => c.Clientid == clientID && c.Internalid == id);
        }

        public bool HasResults(string id)
        {
            return true;//GetTestById(id).FizzAttributes. == null ? false : true;
        }

        public void RemoveResultsFromTest(string testId)
        {
            IEnumerable<AttributeValue> attrs = PostgresContext.AttributeValues.Where(r => r.Testid == testId);
            if (attrs.Any())
            {
                PostgresContext.AttributeValues.RemoveRange(attrs);

            }
                
        }

        public PostgresContext PostgresContext
        {
            get { return Context as PostgresContext; }
        }
    }
}
