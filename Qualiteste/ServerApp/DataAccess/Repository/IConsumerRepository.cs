using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface IConsumerRepository : IRepository<Consumer>
    {
        Consumer GetConsumerById(int id);
        IEnumerable<Consumer> GetConsumersAlphabetically();
        IEnumerable<Consumer> GetConsumersFiltered(string sex, int iage);
    }
}
