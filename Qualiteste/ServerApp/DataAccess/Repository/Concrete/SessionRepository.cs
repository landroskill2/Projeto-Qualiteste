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
            return GetSessionById(id).Tests.ToList();
        }

        public void AddTestToSession(string id, Test test)
        {
            GetSessionById(id).Tests.Add(test);
        }

        public void AddConsumerToSession(string id, IEnumerable<ConsumerSession> consumerSessions)
        {
            //Does not work because creates a new list that is not associated with EF operations
            //GetSessionById(id).ConsumerSessions.ToList().AddRange(consumerSessions);
            foreach (ConsumerSession consumerSession in consumerSessions)
            {
                GetSessionById(id).ConsumerSessions.Add(consumerSession);
            }
            //GetSessionById(id).ConsumerSessions.Add(cs);
        }

        public void RemoveInvitedConsumerFromSession(string sessionId, int consumerId)
        {
            ConsumerSession cs = GetSessionById(sessionId).ConsumerSessions.SingleOrDefault(cs => consumerId == cs.Consumerid);
            PostgresContext.ConsumerSessions.Remove(cs);
        }

        public void RemoveAllInvitedConsumersFromSession(string sessionId)
        {
            IEnumerable<ConsumerSession> cSessions = GetSessionById(sessionId).ConsumerSessions.Where(cs => cs.Sessiontime == null);
            PostgresContext.ConsumerSessions.RemoveRange(cSessions);
        }

        public ConsumerSession? GetConsumerSession(string sessionId, int consumerId)
        {
            ConsumerSession cSession = GetSessionById(sessionId).ConsumerSessions.SingleOrDefault(cs => cs.Consumerid == consumerId);
            return cSession;
        }

        public void UpdateConsumerSession(string id, string consumerId)
        {
            throw new NotImplementedException();
        }


        /*
         These functions may be obsolete on the repository
         */
        public IEnumerable<ConsumerSession> GetNotConfirmedConsumerSessions(string sessionId)
        {
            //Fetch consumers without a sessionTime defined
            return GetSessionById(sessionId).ConsumerSessions.Where(cs => cs.Sessiontime == null);
        }

        public IEnumerable<ConsumerSession> GetConfirmedConsumerSessions(string sessionId)
        {
            Session s = PostgresContext.Sessions.SingleOrDefault(s => s.Sessionid == sessionId);
            return s.ConsumerSessions.Where(cs => cs.Sessiontime != null);
        }
        /*
         ----
        */


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
