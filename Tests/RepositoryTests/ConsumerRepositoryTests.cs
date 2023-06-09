﻿using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.RepositoryTests
{
    [TestFixture]
    internal class ConsumerRepositoryTests
    {
        private ConsumerRepository consumerRepository;
        private PostgresContext context = TestsSetup.context;

        [OneTimeSetUp]
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
            var consumers = consumerRepository.GetConsumersFiltered(sexFilter, 0, null);
            foreach(Consumer c in consumers){
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
            }
           
        }

        [Test]
        public void GetConsumersWithAgeFilteredTest()
        {
            var ageFilter = 70;
            var consumers = consumerRepository.GetConsumersFiltered(null, ageFilter, null);
            var yearOfBirth = DateTime.Today.Year - ageFilter;
            Console.WriteLine(consumers.Count());
            foreach (Consumer c in consumers)
            {
                Assert.That(c.Dateofbirth?.Year, Is.AtMost(yearOfBirth));
            }

        }
        [Test]
        public void GetConsumersWithNameFilteredTest()
        {
            var nameFilter = "Maria";
            var consumers = consumerRepository.GetConsumersFiltered(null, 0, nameFilter);
            foreach (Consumer c in consumers)
            {
                Assert.True(c.Fullname.Contains(nameFilter.ToUpper()));
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
                Assert.True(c.Fullname.Contains(nameFilter.ToUpper()));
            }
        }

        [Test]
        public void CreateConsumerTest()
        {
            Consumer consumer = new ConsumerInputModel
            {
                Id = 999999,
                Fullname = "It's a TEST",
                Nif = "123123123123123",
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 974585214,
                Email = "thisisaemail@email.com"
            }.ToDbConsumer();

            consumerRepository.Add(consumer);
            context.SaveChanges();

            var fetchedConsumer = context.Consumers.SingleOrDefault(c => c.Id == consumer.Id);
            Assert.True(fetchedConsumer?.Equals(consumer));
        }

        [Test]
        public void UpdateConsumerTest()
        {
            Consumer consumer = context.Consumers.SingleOrDefault(c => c.Id == 999999);
            int consumerID = consumer.Id;
            consumer.Sex = "F";
            consumer.Email = "testEmail";
            consumer.Fullname = "Testing update";
            consumer.Contact = 2;
            consumer.Nif = "2";
            consumerRepository.Update(consumer);

            context.SaveChanges();

            Consumer updatedConsumer = context.Consumers.SingleOrDefault(c => c.Id == consumerID);

            Assert.True(updatedConsumer.Sex == "F");
            Assert.True(updatedConsumer.Email == "testEmail");
            Assert.True(updatedConsumer.Fullname == "Testing update");
            Assert.True(updatedConsumer.Contact == 2);
            Assert.True(updatedConsumer.Nif == "2");
        }



        
        [Test]
        public void GetLastIDTest()
        {
            int lastID = context.Consumers.OrderBy(c => c.Id).Last().Id;
            Assert.That(consumerRepository.GetLastID(), Is.EqualTo(lastID));
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            var addedConsumer = context.Consumers.Single(c => c.Nif == "2");
            context.Consumers.Remove(addedConsumer);
        }
    }
}
