using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly ITestService _testService;
        private readonly ICsvService _csvService;

        public TestsController(ITestService testService, ICsvService csvService)
        {
            _testService = testService;
            _csvService = csvService;
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

        [Authorize("ADMIN")]
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

        [Authorize("ADMIN")]
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

        [Authorize("ADMIN")]
        [HttpPost("{id}/consumers")]
        [ProducesResponseType(200, Type = typeof(string))]
        public IActionResult AddConsumerToTest(string id, [FromBody] int consumer)
        {
            try
            {
                Either<CustomError, string> c = _testService.AddConsumerToTest(id, consumer);
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

        [HttpGet("{id}/fizz")]
        public IActionResult GetFizzTable(int id)
        {
            try
            {
                Either<CustomError, FizzTableModel> result = _testService.GetFizzTable(id);
                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                    );
            }catch(Exception e)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }

        [Authorize("ADMIN")]
        [HttpPost("{id}/upload")]
        public async Task<IActionResult> UploadCSV(int id, IFormFile csvFile)
        {
            try
            {
                await _csvService.ParseCsv(csvFile, id);
                return Ok("");
            }catch(Exception ex)
            {
                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
    }
}
