using Microsoft.AspNetCore.Mvc;
using Microsoft.Exchange.WebServices.Data;
using Microsoft.IdentityModel.Tokens;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class AccountService : IAccountService
    {

        private readonly IUnitOfWork _unitOfWork;

        public AccountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // MUDAR RETORNO COM SUCESSO DO EITHER PARA O ID TOKEN
        
        public Either<CustomError, AccountSuccesses> Login(UserDto user)
        {
            User? DbUser = _unitOfWork.Users.GetById(user.Username);
            if(DbUser == null) return new AccountErrors.UsernameNotFound(); 

            string encryptedPassword = SHA256Encryption.EncryptString(user.Password);

            if (encryptedPassword != DbUser.Pwd) return new AccountErrors.IncorrectPassword();

            return new AccountSuccesses.LoginSuccess(GenerateToken(DbUser)); 

        }

        private string GenerateToken(User dbUser)
        {
            {
                var mySecret = TokenSettings.Key;
                var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));

                var myIssuer = TokenSettings.Issuer;
                var myAudience = TokenSettings.Audience;

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, dbUser.Username),
                        new Claim(ClaimTypes.Role, dbUser.RoleNavigation.Roledesignation)
                    }),
                        Expires = TokenSettings.Expiration,
                        Issuer = myIssuer,
                        Audience = myAudience,
                        SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
        }

        public Either<CustomError, AccountSuccesses> CreateAccount(UserDto user)
        {

            var encryptedPassword = SHA256Encryption.EncryptString(user.Password);
            User dbUser = new()
            {
                Username = user.Username,
                Pwd = encryptedPassword,
                Role = _unitOfWork.Users.GetRoleIDByDesignation(user.Role)
            };

            _unitOfWork.Users.Add(dbUser);

            if(user.Role == "CLIENT") 
            {
                if(user.Id == null || user.Designation == null) return new AccountErrors.MissingFieldsOnUserCreation();
                
                Client dbClient = new()
                {
                    Id = user.Id,
                    Designation = user.Designation
                };
                _unitOfWork.Clients.Add(dbClient);
            }

            _unitOfWork.Complete();

            return new AccountSuccesses.CreateAccountSuccess(user.Username);
        }

        public Either<CustomError, IEnumerable<UserDto>> GetAccounts()
        {
            try
            {
                List<UserDto> users = _unitOfWork.Users.GetAll().Select(u => u.toOutputModel()).ToList();
                return users;
            }catch(Exception ex)
            {
                throw ex;
            }
        }

        public Either<CustomError, AccountSuccesses> DeleteAccount([FromQuery] string username)
        {
            try {
                User target = _unitOfWork.Users.GetById(username);
                if (target == null) return new AccountErrors.UsernameNotFound();
                Client? client = target.Clients.FirstOrDefault();
                if (client != null)
                {
                    if (client.Tests.Any())
                    {
                        client.Tests.Clear();
                    }
                }
                target.Clients.Clear();
                _unitOfWork.Users.Remove(target);
                _unitOfWork.Complete();
                return new AccountSuccesses.DeleteAccountSuccess();
            }
            catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
            
        }
    }
}
