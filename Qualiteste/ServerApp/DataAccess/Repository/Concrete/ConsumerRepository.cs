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

        public IEnumerable<Consumer> GetConsumersFiltered(string? sex, int? iage, string? name) {
            Expression<Func<Consumer, bool>> p = c => (iage == null || ((DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage)
                                                 && (name == null || c.Fullname.Contains(name.ToUpper()))
                                                 && (sex == null || c.Sex == sex.ToUpper()));

            
            var consumers = PostgresContext.Consumers.Where(p);
            return consumers;
        }

        public int GetLastID()
        {
            return PostgresContext.Consumers.Max(c => c.Id);
        }

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
