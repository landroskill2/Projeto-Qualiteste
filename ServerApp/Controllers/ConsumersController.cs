using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Services;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumersController : ControllerBase
    {
        private readonly IConsumerService _consumerService;

        public ConsumersController(IConsumerService consumerService)
        {
            _consumerService = consumerService;
        }
    }
}
