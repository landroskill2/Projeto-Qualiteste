using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Services
{
    public interface IConsumerService
    {
        int CreateNewConsumer(ConsumerInputModel consumer);
        ConsumerOutputModel GetConsumerById(int id);
        IEnumerable<ConsumerOutputModel> GetConsumersAlphabetically();
        IEnumerable<ConsumerOutputModel> GetConsumersFiltered(string sex, string age, string name);
        ConsumerOutputModel UpdateConsumer(int id, ConsumerInputModel consumer);
    }
}
