using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Authorize(Roles ="ADMIN")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;
        public ClientsController(IClientService clientService) { 
            _clientService = clientService;
        }

        [HttpGet]
        public IActionResult GetAllClients()
        {
            try 
            {
                Either<CustomError, IEnumerable<ClientOutputModel>> result = _clientService.GetAllClients();
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
    }
}
