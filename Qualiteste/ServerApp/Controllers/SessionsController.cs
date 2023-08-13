using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    //[Authorize]
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
        [ProducesResponseType(200, Type = typeof(SessionPageModel))]
        [ProducesResponseType(500)]
        public IActionResult GetSessionById(string id)
        {
            try
            {
                Either<CustomError, SessionPageModel> result = _sessionService.GetSessionById(id);
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

        [Authorize(Roles = "ADMIN")]
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

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        [ProducesResponseType(200, Type = typeof(SessionOutputModel))]
        public IActionResult UpdateSession(string id, [FromBody] SessionInputModel sessionInput)
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


        [Authorize(Roles = "ADMIN")]
        [HttpPost("{id}/tests")]
        public IActionResult AddTestToSession(string id, [FromBody] string test)
        {
            try
            {
                Either<CustomError, SessionSuccesses> c = _sessionService.AddTestToSession(id, test);
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


        [Authorize(Roles = "ADMIN")]
        [HttpPost("{id}/consumers")]
        public IActionResult AddConsumerToSession(string id, [FromBody] ConsumerSessionInputModel consumerSession)
        {
            try
            { 
                Either<CustomError, SessionSuccesses> c = _sessionService.AddConsumerToSession(id, consumerSession);
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

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}/consumers")]
        public IActionResult RemoveInvitedConsumerFromSession(string id, [FromQuery] string selection)
        {
            try
            {
                Either<CustomError, SessionSuccesses> c = _sessionService.RemoveInvitedConsumerFromSession(id, selection);
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

        [HttpPut("{id}/consumers/{cId}/time")]
        public IActionResult UpdateConsumerSessionTime(string id, int cId, [FromBody] SessionTimeInputModel consumerSession)
        {
            try
            {
                Either<CustomError, SessionSuccesses> c = _sessionService.ConfirmConsumerSession(id, cId, consumerSession);
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


        /**
         * Não sei se o endpoint faz sentido, secalhar mudar o UpdateConsumerSessionTime para o URI ter o id do consumidor e a attendance ser
         * "{id}/consumers/{cId}/attendance" ou então "{id}/consumers/attendance"
         */
        [HttpPut("{id}/consumers/{cId}/attendance")]
        public IActionResult UpdateConsumerAttendance(string id, int cId, [FromBody] SessionAttendanceInputModel cSession)
        {
            try
            {
                
                Either<CustomError, SessionSuccesses> c = _sessionService.UpdateAttendanceOfConsumerSession(id, cId, cSession);
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
