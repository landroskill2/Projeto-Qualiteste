using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository.Concrete
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DbContext context) : base(context)
        {
        }

        public User? GetById(string username)
        {
            return PostgresContext.Users.SingleOrDefault(u => u.Username == username);
        }

        public int? GetRoleIDByDesignation(string role)
        {
            return PostgresContext.Roles.SingleOrDefault(r => r.Roledesignation == role).Roleid;
        }

        public PostgresContext PostgresContext
        {
            get { return Context as PostgresContext; }
        }
    }
}
