using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ISessionService
    {
        Either<CustomError, SessionSuccesses> AddConsumerToSession(string id, ConsumerSessionInputModel consumerSession);
        Either<CustomError, SessionSuccesses> AddTestToSession(string id, string test);
        Either<CustomError, string> CreateNewSession(SessionInputModel sessionInput);
        Either<CustomError, SessionPageModel> GetSessionById(string id);
        Either<CustomError, IEnumerable<SessionOutputModel>> GetSessionsList();
        Either<CustomError, SessionOutputModel> UpdateSession(string id, SessionInputModel sessionInput);
        Either<CustomError, IEnumerable<ConsumerSessionOutputModel>> GetConfirmedConsumersInSession(string sessionId);
        Either<CustomError, SessionSuccesses> ConfirmConsumerSession(string sessionId, int consumerId, SessionTimeInputModel cSession);
        Either<CustomError, SessionSuccesses> UpdateAttendanceOfConsumerSession(string sessionId, int consumerId, SessionAttendanceInputModel cSession);
        Either<CustomError, SessionSuccesses> RemoveConsumerFromSession(string id, string selection);
    }
}
