using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Dtos;
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

        [Test]
        public void GetTestByID()
        {
            Test test = testRepository.GetTestById("443244");

            Assert.That(test.Internalid, Is.EqualTo("443244"));
            Assert.That(test.Product, Is.EqualTo(122332));
            Assert.That(test.Testtype, Is.EqualTo("SP"));
            Assert.That(test.Consumersnumber, Is.EqualTo(10));

        }

    }
}
