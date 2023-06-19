using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IUserRepository
    {
        User? GetById(string username);
    }
}
