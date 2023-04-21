using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.ServiceTests
{
    internal class ConsumerServiceTests : TestsSetup
    {
        private ConsumerService consumerService;
        private UnitOfWork unitOfWork;

        [SetUp]
        public void SetUp()
        {
            unitOfWork = new UnitOfWork(context);
            consumerService = new ConsumerService(unitOfWork);
        }

        [Test]
        public void GetConsumersAlphabeticallyTest()
        {
            IEnumerable<Consumer> consumers = consumerService.GetConsumersAlphabetically();
        }
    }
}
