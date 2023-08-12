using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IUserRepository : IRepository<User>
    {
        User? GetById(string username);
        int? GetRoleIDByDesignation(string role);
    }
}
