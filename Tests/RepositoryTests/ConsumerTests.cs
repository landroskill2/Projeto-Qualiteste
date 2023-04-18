using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.RepositoryTests
{
    internal class ConsumerTests : TestsSetup
    {
        private ConsumerRepository consumerRepository;

        [SetUp]
        public void SetUp()
        {
            consumerRepository = new ConsumerRepository(context);
        }

        [TearDown]
        public void TearDown()
        {

        }
    }
}
