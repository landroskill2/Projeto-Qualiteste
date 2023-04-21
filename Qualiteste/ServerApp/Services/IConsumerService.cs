using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IConsumerService
    {
        int CreateNewConsumer(ConsumerInputModel consumer);
        Either<CustomError, ConsumerOutputModel> GetConsumerById(int id);
        IEnumerable<ConsumerOutputModel> GetConsumersAlphabetically();
        IEnumerable<ConsumerOutputModel> GetConsumersFiltered(string sex, string age, string name);
        ConsumerOutputModel UpdateConsumer(int id, ConsumerInputModel consumer);
    }
}
