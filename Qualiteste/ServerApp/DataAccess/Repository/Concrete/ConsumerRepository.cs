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
            return PostgresContext.Consumers.Single(c => c.Id == id);
        }

        public IEnumerable<Consumer> GetConsumersFiltered(string sex, int iage, string name) {
            Expression<Func<Consumer, bool>> p = c => Filter(c, sex, iage, name);
            return GetConsumersFiltered(p);
        }

        public bool Filter(Consumer c, string sex, int iage, string name)
        {
            bool sexCondition = sex == "*" ? true : c.Sex == sex;
            bool nameCondition = name == "*" ? true : c.Fullname.Contains(name);
            bool ageCondition = (DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage;

            return sexCondition && nameCondition && ageCondition;
        }
        public IEnumerable<Consumer> GetConsumersFiltered(Expression<Func<Consumer, bool>> p)
        {
            IEnumerable<Consumer> consumers;
            consumers = PostgresContext.Consumers.Where(p).OrderBy(c => c.Fullname);
            return consumers;
        }

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
