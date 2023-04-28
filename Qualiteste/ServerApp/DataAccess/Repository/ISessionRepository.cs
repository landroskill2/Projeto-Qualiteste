using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ISessionRepository : IRepository<Session>
    {
        IEnumerable<object> GetSessionsByDate();
    }
}
