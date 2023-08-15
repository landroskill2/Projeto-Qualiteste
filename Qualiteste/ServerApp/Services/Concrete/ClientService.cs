using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class ClientService : IClientService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ClientService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Either<CustomError, IEnumerable<ClientOutputModel>> GetAllClients()
        {
            return _unitOfWork.Clients.GetAll().Select(c => new ClientOutputModel
            {
                ClientDesignation = c.Designation,
                ClientId = c.Id
            }).ToList();
        }


    }
}
