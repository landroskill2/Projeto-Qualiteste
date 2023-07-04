﻿using Microsoft.Exchange.WebServices.Data;
using Microsoft.IdentityModel.Tokens;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
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

        public string CreateUser(UserDto user)
        {
            throw new NotImplementedException();
        }

        // MUDAR RETORNO COM SUCESSO DO EITHER PARA O ID TOKEN
        Either<CustomError, string> IAccountService.Login(UserDto user)
        {

            User? DbUser = _unitOfWork.Users.GetById(user.Username);
            if(DbUser == null) return new UsernameNotFound(); 

            string encryptedPassword = SHA256Encryption.EncryptString(user.Password);

            if (encryptedPassword != DbUser.Pwd) return new IncorrectPassword();

            return GenerateToken(DbUser);

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
    }
}
