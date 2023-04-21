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

        public Consumer GetConsumerById(int id)
        {
            return PostgresContext.Consumers.SingleOrDefault(c => c.Id == id);
        }

        public IEnumerable<Consumer> GetConsumersFiltered(string sex, int iage, string name) {
            Expression<Func<Consumer, bool>> sexPredicate = c => sex.Equals("*") ? true : c.Sex == sex;
            Expression<Func<Consumer, bool>> namePredicate = c => name.Equals("*") ? true : c.Fullname.Contains(name);
            Expression<Func<Consumer, bool>> agePredicate = c => (DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage;

            return GetConsumersFiltered(sexPredicate, namePredicate, agePredicate);
        }

        public IEnumerable<Consumer> GetConsumersFiltered(
            Expression<Func<Consumer, bool>> sexP,
            Expression<Func<Consumer, bool>> nameP,
            Expression<Func<Consumer, bool>> ageP
            )
        {
            IEnumerable<Consumer> consumers;
            consumers = PostgresContext.Consumers
                .Where(sexP)
                .Where(ageP)
                .Where(nameP)
                .OrderBy(c => c.Fullname);
            return consumers;
        }

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
