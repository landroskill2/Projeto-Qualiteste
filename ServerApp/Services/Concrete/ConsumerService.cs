using Qualiteste.ServerApp.DataAccess;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class ConsumerService : IConsumerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ConsumerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    }
}
