using Microsoft.EntityFrameworkCore;
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

        public PostgresContext PostgresContext
        { 
            get { return Context as PostgresContext; }
        }
    }
}
