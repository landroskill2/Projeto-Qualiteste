using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository(PostgresContext context) : base(context)
        {
        }

        public Session? GetSessionById(string id)
        {
            return PostgresContext.Sessions.SingleOrDefault(s => s.Sessionid == id);
        }

        public IEnumerable<Session> GetSessionsByDate()
        {
            return PostgresContext.Sessions.OrderByDescending(s => s.Sessiondate).ToList();
        }

        public IEnumerable<Test> GetTestsInSession(string id)
        {
            return null;//GetSessionById(id).Tests.ToList();
        }

        public IEnumerable<Consumer> GetConsumersInSession(string id)
        {
            return GetSessionById(id).ConsumerSessions.Select(cs => cs.Consumer).ToList();
        }

        public PostgresContext PostgresContext
        {
            get { return Context as PostgresContext; }
        }
    }
}
