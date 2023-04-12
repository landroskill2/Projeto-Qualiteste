using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class ConsumerRepository : Repository<Consumer>, IConsumerRepository
    {
        public ConsumerRepository(PostgresContext context) : base(context)
        {
        }
    }
}
