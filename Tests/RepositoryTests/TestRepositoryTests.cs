using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.RepositoryTests
{
    [TestFixture]
    internal class TestRepositoryTests : TestsSetup
    {

        private TestRepository testRepository;

        [OneTimeSetUp]
        public void SetUp()
        {
            testRepository = new TestRepository(context);
        }

        [Test]
        public void ListByDescendingDate()
        {
            var firstId = "343123";
            var lastId = "443244";
            IEnumerable<Test> tests = testRepository.ListTestsByDate();

            Assert.That(tests.First().Internalid, Is.EqualTo(firstId));
            Assert.That(tests.Last().Internalid, Is.EqualTo(lastId));

        }

    }
}
