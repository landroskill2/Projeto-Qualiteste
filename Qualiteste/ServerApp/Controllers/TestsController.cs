using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly ITestService _testService;

        public TestsController(ITestService testService)
        {
            _testService = testService;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TestOutputModel>))]
        [ProducesResponseType(500)]
        public IActionResult GetTestsList([FromQuery] string? type)
        {
            try
            {
                if(type != null)
                {
                    Either<CustomError, IEnumerable<TestOutputModel>> result = _testService.GetFilteredTestsList(type);
                    return result.Match(
                        error => Problem(statusCode: error.StatusCode, title: error.Message),
                        success => Ok(success)
                        );
                }
                else 
                {
                    Either<CustomError, IEnumerable<TestOutputModel>> result = _testService.GetTestsList();
                    return result.Match(
                        error => Problem(statusCode: error.StatusCode, title: error.Message),
                        success => Ok(success)
                        );

                }

            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(TestOutputModel))]
        [ProducesResponseType(500)]
        public IActionResult GetTestById(string id)
        {
            try
            {
                Either<CustomError, TestPageModel> result = _testService.GetTestById(id);
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
        public IActionResult CreateNewTest([FromBody] TestInputModel testInput)
        {
            try
            {
                Either<CustomError, string> result = _testService.CreateNewTest(testInput);
                var actionName = nameof(TestsController.GetTestById);
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => CreatedAtAction(actionName, new { id = success }, testInput)
                    );

            }
            catch (Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200, Type = typeof(TestOutputModel))]
        public IActionResult UpdateTest(int id, [FromBody] TestInputModel testInput)
        {
            try
            {
                Either<CustomError, TestOutputModel> c = _testService.UpdateTest(id, testInput);
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
