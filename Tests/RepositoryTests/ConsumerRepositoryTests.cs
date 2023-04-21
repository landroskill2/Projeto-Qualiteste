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
    internal class ConsumerRepositoryTests : TestsSetup
    {
        private ConsumerRepository consumerRepository;


        [SetUp]
        public void SetUp()
        {
            consumerRepository = new ConsumerRepository(context);
        }

        [Test]
        public void GetConsumersAlphabeticallyTest()
        {
            var nifFirst = "111111111111119";
            var nifLast = "444444444444444";
            var consumers = consumerRepository.GetConsumersAlphabetically();
            Assert.That(consumers.First().Nif, Is.EqualTo(nifFirst));
            Assert.That(consumers.Last().Nif, Is.EqualTo(nifLast));
        }
        [Test]
        public void GetConsumersWithSexFilteredTest()
        {
            var sexFilter = "F";
            var consumers = consumerRepository.GetConsumersFiltered(sexFilter, 0, "*");
            foreach(Consumer c in consumers){
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
            }
           
        }

        [Test]
        public void GetConsumersWithAgeFilteredTest()
        {
            var ageFilter = 70;
            var consumers = consumerRepository.GetConsumersFiltered("*", ageFilter, "*");
            var yearOfBirth = DateTime.Today.Year - ageFilter;
            foreach (Consumer c in consumers)
            {
                Assert.That(c.Dateofbirth?.Year, Is.AtMost(yearOfBirth));
            }

        }
        [Test]
        public void GetConsumersWithNameFilteredTest()
        {
            var nameFilter = "Maria";
            var consumers = consumerRepository.GetConsumersFiltered("*", 0, nameFilter);
            foreach (Consumer c in consumers)
            {
                Assert.True(c.Fullname.Contains(nameFilter));
            }

        }

        [Test]
        public void GetConsumersFullFilteredTest()
        {
            var nameFilter = "Maria";
            var sexFilter = "F";
            var ageFilter = 70;
            var yearOfBirth = DateTime.Today.Year - ageFilter;
            var consumers = consumerRepository.GetConsumersFiltered(sexFilter, ageFilter, nameFilter);
            foreach (Consumer c in consumers)
            {
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
                Assert.That(c.Dateofbirth?.Year, Is.AtMost(yearOfBirth));
                Assert.True(c.Fullname.Contains(nameFilter));
            }
        }

        [Test]
        public void CreateConsumerTest()
        {
            Consumer consumer = new ConsumerInputModel
            {
                Fullname = "It's a TEST",
                Nif = "123123123123123",
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 974585214,
                Email = "thisisaemail@email.com"
            }.ToDbConsumer();

            consumerRepository.Add(consumer);
            context.SaveChanges();

            var consumers = consumerRepository.GetConsumersAlphabetically();
            Assert.True(consumers.Any(c => c.Nif == consumer.Nif));
        }

        [Test]
        public void GetLastIDTest()
        {
            int lastID = context.Consumers.OrderBy(c => c.Id).Last().Id;
            Assert.That(consumerRepository.GetLastID(), Is.EqualTo(lastID));
        }

        [TearDown]
        public void TearDown()
        {

        }
    }
}
