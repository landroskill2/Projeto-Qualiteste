using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Errors;

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

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(ConsumerOutputModel))]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]

        public IActionResult GetConsumerById([FromRoute] int id)
        {
            try {
                ConsumerOutputModel consumer = _consumerService.GetConsumerById(id);
                return Ok(consumer);
            }
            catch(NoConsumerFoundWithId ex) 
            {
                return NotFound(ex.Message);
            }
            catch(Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ConsumerOutputModel>))]
        [ProducesResponseType(500)]
        public IActionResult GetConsumersList([FromQuery] string? sex, [FromQuery] string? age) 
        {
            IEnumerable<ConsumerOutputModel> consumers;
            try {
                if (sex != null)
                {
                    consumers = _consumerService.GetConsumersFiltered(sex);
                }
                else 
                {
                    consumers = _consumerService.GetConsumersAlphabetically();
                }
                return Ok(consumers);
            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title:"Ocorreu um erro inesperado");
            }
        }
        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult CreateNewConsumer([FromBody] ConsumerInputModel consumer)
        {
            try
            {
                int res = _consumerService.CreateNewConsumer(consumer);
                var actionName = nameof(ConsumersController.GetConsumerById);
                var routeValue = new { id = res };
                return CreatedAtAction(actionName, routeValue);
            }
            catch(Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

    }
}
