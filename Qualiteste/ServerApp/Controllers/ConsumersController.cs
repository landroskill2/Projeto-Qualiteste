using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;
using System.Reflection.Metadata.Ecma335;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            try
            {
                Either<CustomError, ConsumerPageModel> result = _consumerService.GetConsumerById(id);

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );
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
            Either<CustomError, IEnumerable<ConsumerOutputModel>> result;
            try {
                if (sex != null || age != null || name != null)
                {
                    result = _consumerService.GetConsumersFiltered(sex,age,name);
                    return result.Match(
                            error => Problem(statusCode: error.StatusCode, title: error.Message),
                            success => Ok(success)
                        );
                }
                else 
                {
                    result = _consumerService.GetConsumersAlphabetically();
                    return result.Match(
                            error => Problem(statusCode: error.StatusCode, title: error.Message),
                            success => Ok(success)
                        );
                }
            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title:"Ocorreu um erro inesperado");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult CreateNewConsumer([FromBody] ConsumerInputModel consumer)
        {
            try
            {
                Either<CustomError, int> result = _consumerService.CreateNewConsumer(consumer);
                var actionName = nameof(ConsumersController.GetConsumerById);
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => CreatedAtAction(actionName, new { id = success }, consumer)
                    );
                
            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        [ProducesResponseType(200, Type = typeof(ConsumerOutputModel))]

        public IActionResult UpdateConsumer(int id, [FromBody] ConsumerInputModel consumer)
        {
            try 
            {
                Either<CustomError, ConsumerOutputModel> c = _consumerService.UpdateConsumer(id, consumer);
                return c.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                    );
            }
            catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }


        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(ConsumerOutputModel))]

        public IActionResult DeleteConsumer(int id)
        {
            try
            {
                Either<CustomError, ConsumerOutputModel> c = _consumerService.DeleteConsumer(id);
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
