using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface ICsvService
    {
        Task<Either<CustomError,TestSuccesses>> ParseCsv(IFormFile csvFile, string id);
    }
}
