using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ISessionService
    {
        Either<CustomError, string> AddConsumerToSession(string id, IEnumerable<ConsumerSessionInputModel> consumerSession);
        Either<CustomError, string> AddTestToSession(string id, string test);
        Either<CustomError, string> CreateNewSession(SessionInputModel sessionInput);
        Either<CustomError, SessionPageModel> GetSessionById(string id);
        Either<CustomError, IEnumerable<SessionOutputModel>> GetSessionsList();
        Either<CustomError, SessionOutputModel> UpdateSession(int id, SessionInputModel sessionInput);
        Either<CustomError, IEnumerable<ConsumerSessionOutputModel>> GetConfirmedConsumersInSession(string sessionId);

        Either<CustomError, string> RemoveInvitedConsumerFromSession(string sessionId, string selection);
    }
}
