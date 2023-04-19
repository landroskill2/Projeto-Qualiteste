using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;

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

        public IEnumerable<Consumer> GetConsumersFiltered(string sex, int iage, string name)
        {
            IEnumerable<Consumer> consumers;
            if (sex.Equals("*"))
            {
                consumers = PostgresContext.Consumers.Where(c => (DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage).OrderBy(c => c.Fullname);
            }
            else 
            {
                consumers = PostgresContext.Consumers.Where(c =>
                    c.Sex == sex &&
                    (DateTime.Today.Year - c.Dateofbirth.Value.Year) >= iage
                ).OrderBy(c => c.Fullname);
            }
            if (name.Equals("*")) return consumers;
            return consumers.Where(c => c.Fullname.Contains(name));
        }

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
