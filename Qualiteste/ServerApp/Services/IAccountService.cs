using Microsoft.AspNetCore.Identity;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IAccountService
    {
        Either<CustomError, IEnumerable<UserDto>> GetAccounts();
        Either<CustomError, AccountSuccesses> Login(UserDto user);
        Either<CustomError, AccountSuccesses> CreateAccount(UserDto user);

        Either<CustomError, AccountSuccesses> DeleteAccount(string username);
    }
}
