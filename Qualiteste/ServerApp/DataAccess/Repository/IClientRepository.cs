using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IClientRepository : IRepository<Client>
    {
        string GetClientIDByUsername(string username);
    }
}
