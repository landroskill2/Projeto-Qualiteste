﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {

        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("login")]
        public IActionResult Login(UserDto user)
        {
            try
            {
                Either<CustomError, string> result = _accountService.Login(user);

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );
                
            }catch(Exception e)
            {

                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("register")]
        public IActionResult Register(UserDto user)
        {
            try
            {
                Either<CustomError, string> result = _accountService.CreateAccount(user);

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );
                
            }catch(Exception e)
            {

                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public IActionResult GetAccounts()
        {
            try{
                Either<CustomError, IEnumerable<UserDto>> result = _accountService.GetAccounts();

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );

            }catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
    }
}
