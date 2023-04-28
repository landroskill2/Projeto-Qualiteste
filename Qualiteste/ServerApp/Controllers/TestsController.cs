﻿using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetTestsList()
        {
            try
            {
                Either<CustomError, IEnumerable<TestOutputModel>> result = _testService.GetTestsList();
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
        [ProducesResponseType(200, Type = typeof(TestOutputModel))]
        [ProducesResponseType(500)]
        public IActionResult GetTestById(int id)
        {
            try
            {
                Either<CustomError, TestOutputModel> result = _testService.GetTestById();
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
