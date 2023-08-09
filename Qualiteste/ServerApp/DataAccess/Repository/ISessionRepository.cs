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

        ConsumerSession GetConsumerSession(string sessionId, int consumerId);
        void AddConsumerToSession(string id, IEnumerable<ConsumerSession> consumerSessions);

        void RemoveInvitedConsumerFromSession(string sessionId, int consumerId);

        void RemoveAllInvitedConsumersFromSession(string sessionId);
        void AddTestToSession(string id, Test test);
    }
}
