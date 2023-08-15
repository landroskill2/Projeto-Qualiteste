using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IClientService
    {
        Either<CustomError, IEnumerable<ClientOutputModel>> GetAllClients();

    }
}
