using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IConsumerService
    {
        Either<CustomError, int> CreateNewConsumer(ConsumerInputModel consumer);
        Either<CustomError, ConsumerOutputModel> GetConsumerById(int id);
        Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersAlphabetically();
        Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersFiltered(string sex, string age, string name);
        Either<CustomError, ConsumerOutputModel> UpdateConsumer(int id, ConsumerInputModel consumer);
    }
}
