using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session? GetSessionById(string id);
        IEnumerable<Session> GetSessionsByDate();
        IEnumerable<Test> GetTestsInSession(string id);
        IEnumerable<Consumer> GetConsumersInSession(string id);

        IEnumerable<ConsumerSession> GetConfirmedConsumerSessions(string sessionId);
        IEnumerable<ConsumerSession> GetNotConfirmedConsumerSessions(string sessionId);

        void AddConsumerToSession(string id, IEnumerable<ConsumerSession> consumerSessions);
        void AddTestToSession(string id, Test test);
    }
}
