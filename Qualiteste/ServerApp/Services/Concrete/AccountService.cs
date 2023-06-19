using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class AccountService : IAccountService
    {

        private readonly IUnitOfWork _unitOfWork;

        public AccountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public string CreateUser(UserDto user)
        {
            throw new NotImplementedException();
        }

        // MUDAR RETORNO COM SUCESSO DO EITHER PARA O ID TOKEN
        Either<CustomError, string> IAccountService.Login(UserDto user)
        {

            User? DbUser = _unitOfWork.Users.GetById(user.Username);
            if(DbUser == null) { return null; } //retornar erro a dizer que o username está errado

            string encryptedPassword = SHA256Encryption.EncryptString(user.Password);

            if (encryptedPassword != DbUser.Pwd) return null; //retornar erro a dizer que a password está errada

            return "sucesso"; // retornar id token
        }
    }
}
