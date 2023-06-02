using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session? GetSessionById(string id);
        IEnumerable<Session> GetSessionsByDate();
        IEnumerable<Test> GetTestsInSession(string id);
        IEnumerable<Consumer> GetConsumersInSession(string id);
        void AddConsumerToSession(string id, int consumer);
        void AddTestToSession(string id, Test test);
    }
}
