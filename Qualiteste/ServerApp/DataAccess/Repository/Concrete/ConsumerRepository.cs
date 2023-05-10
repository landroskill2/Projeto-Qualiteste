using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using System.Drawing;
using System;
using System.Linq.Expressions;
using System.Xml;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class ConsumerRepository : Repository<Consumer>, IConsumerRepository
    {

        public ConsumerRepository(PostgresContext context) : base(context)
        {
        }

        public IEnumerable<Consumer> GetConsumersAlphabetically()
        {
            return PostgresContext.Consumers.OrderBy(c => c.Fullname);
        }

        public Consumer? GetConsumerById(int id)
        {
            return PostgresContext.Consumers.SingleOrDefault(c => c.Id == id);
        }

        public IEnumerable<Consumer> GetConsumersFiltered(string sex, int iage, string name) {
            Expression<Func<Consumer, bool>> p = c => sex.Equals("*") ? true : c.Sex == sex.ToUpper()
                                                && name.Equals("*") ? true : c.Fullname.Contains(name.ToUpper())
                                                && (DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage;

            

            return PostgresContext.Consumers.Where(p);
        }

        public int? GetLastID()
        {
            return PostgresContext.Consumers.Max(c => c.Id);
        }

        public IEnumerable<Session> GetConsumerSessions(int id)
        {
            return GetConsumerById(id).ConsumerSessions.Select(cs => cs.Session).ToList();
        }

        public IEnumerable<Test> GetConsumerTests(int id)
        {
            //fetch from ConsumerSps too
            return GetConsumerById(id).ConsumerHts.Select(ch => ch.Test).ToList();
        }

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
