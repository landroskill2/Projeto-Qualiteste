﻿using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {

        private readonly ISessionService _sessionService;

        public SessionsController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SessionOutputModel>))]
        [ProducesResponseType(500)]
        public IActionResult GetSessionsList()
        {
            try
            {
                Either<CustomError, IEnumerable<SessionOutputModel>> result = _sessionService.GetSessionsList();
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                    );

            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(SessionOutputModel))]
        [ProducesResponseType(500)]
        public IActionResult GetSessionById(string id)
        {
            try
            {
                Either<CustomError, SessionOutputModel> result = _sessionService.GetSessionById(id);
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                    );

            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }

        }

        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult CreateNewSession([FromBody] SessionInputModel sessionInput)
        {
            try
            {
                Either<CustomError, string> result = _sessionService.CreateNewSession(sessionInput);
                var actionName = nameof(SessionsController.GetSessionById);
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => CreatedAtAction(actionName, new { id = success }, sessionInput)
                    );

            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200, Type = typeof(SessionOutputModel))]
        public IActionResult UpdateSession(int id, [FromBody] SessionInputModel sessionInput)
        {
            try
            {
                Either<CustomError, SessionOutputModel> c = _sessionService.UpdateSession(id, sessionInput);
                return c.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                    );
            }
            catch (Exception e)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
    }
}
