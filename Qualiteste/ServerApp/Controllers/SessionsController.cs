using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Services;

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
    }
}
