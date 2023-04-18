using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository(PostgresContext context) : base(context)
        {
        }
    }
}
