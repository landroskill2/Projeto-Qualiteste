﻿using Microsoft.AspNetCore.Identity;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services
{
    public interface IAccountService
    {
        Either<CustomError, string> Login(UserDto user);
        Either<CustomError, string> CreateAccount(UserDto user);
    }
}
