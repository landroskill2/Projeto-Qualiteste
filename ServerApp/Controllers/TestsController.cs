using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Services.Concrete;

namespace Qualiteste.ServerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly TestService _testService;

        public TestsController(TestService testService)
        {
            _testService = testService;
        }
    }
}
