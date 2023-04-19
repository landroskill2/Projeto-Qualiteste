using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
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

        public IActionResult GetConsumerById(int id)
        {
            try {
                ConsumerOutputModel consumer = _consumerService.GetConsumerById(id);
                return Ok(consumer);
            }
            catch(CustomError ex) 
            {
                return Problem(statusCode: ex.StatusCode, title : ex.Message);
            }
            catch(Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ConsumerOutputModel>))]
        [ProducesResponseType(500)]
        public IActionResult GetConsumersList([FromQuery] string? sex, [FromQuery] string? age, [FromQuery] string? name) 
        {
            IEnumerable<ConsumerOutputModel> consumers;
            try {
                if (sex != null || age != null || name != null)
                {
                    consumers = _consumerService.GetConsumersFiltered(sex,age,name);
                }
                else 
                {
                    consumers = _consumerService.GetConsumersAlphabetically();
                }
                return Ok(consumers);
            }
            catch (CustomError ex)
            {
                return Problem(statusCode: ex.StatusCode, title: ex.Message);
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
                return CreatedAtAction(actionName, routeValue, consumer);
            }
            catch (CustomError ex)
            {
                return Problem(statusCode: ex.StatusCode, title: ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200, Type = typeof(ConsumerOutputModel))]

        public IActionResult UpdateConsumer(int id, [FromBody] ConsumerInputModel consumer)
        {
            try 
            {
                ConsumerOutputModel c = _consumerService.UpdateConsumer(id, consumer);
                return Ok(c);
            }
            catch (CustomError e)
            {
                return Problem(statusCode: e.StatusCode, title: e.Message);
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
    }
}
