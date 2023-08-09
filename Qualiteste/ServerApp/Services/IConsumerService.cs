using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IConsumerService
    {
        Either<CustomError, int> CreateNewConsumer(ConsumerInputModel consumer);
        Either<CustomError, ConsumerPageModel> GetConsumerById(int id);
        Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersAlphabetically();
        Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersFiltered(string sex, string minAge, string maxAge, string name);
        Either<CustomError, ConsumerOutputModel> UpdateConsumer(int id, ConsumerInputModel consumer);
        Either<CustomError, ConsumerOutputModel> DeleteConsumer(int id);

    }
}
