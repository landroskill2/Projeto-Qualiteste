﻿using Qualiteste.ServerApp.DataAccess.Repository;
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
    internal class TestRepositoryTests
    {

        private TestRepository testRepository;
        private PostgresContext context = TestsSetup.context;

        [OneTimeSetUp]
        public void SetUp()
        {
            testRepository = new TestRepository(context);
        }

        [Test]
        public void ListByDescendingDate()
        {
            var firstId = "583828";
            var lastId = "443244";
            IEnumerable<Test> tests = testRepository.ListTestsByDate();

            Assert.That(tests.First().Internalid, Is.EqualTo(firstId));
            Assert.That(tests.Last().Internalid, Is.EqualTo(lastId));
            context.ChangeTracker.Clear();

        }

        [Test]
        public void GetTestByID()
        {
            Test test = testRepository.GetTestById("443244");

            Assert.That(test.Internalid, Is.EqualTo("443244"));
            Assert.That(test.Product, Is.EqualTo(321321));
            Assert.That(test.Testtype, Is.EqualTo("SP"));
            Assert.That(test.Consumersnumber, Is.EqualTo(10));
            context.ChangeTracker.Clear();

        }

        [Test]
        public void CreateTest()
        {
            Test test = new TestInputModel
            {
                ID = "99999",
                Product = 324231,
                TestType = "SP",
                ConsumersNumber = 15,
                RequestDate = DateOnly.Parse("2023-03-24"),
            }.toDbTest();

            testRepository.Add(test);
            context.SaveChanges();

            var fetchedTest = context.Tests.SingleOrDefault(t => t.Internalid == test.Internalid);

            Assert.True(fetchedTest?.Equals(test));
            context.ChangeTracker.Clear();

        }

        [Test]
        public void UpdateConsumerTest()
        {


            Test test = context.Tests.SingleOrDefault(t => t.Internalid == "443244");
            string testID = test.Internalid;
            test.Requestdate = DateOnly.Parse("1999-04-19");

            Consumer consumer = context.Consumers.First();
            int consumerID = consumer.Id;
            consumer.Sex = "F";
            consumer.Email = "testEmail";
            consumer.Fullname = "Testing update";
            consumer.Contact = 5;
            consumer.Nif = "5";
            context.Consumers.Update(consumer);

            context.SaveChanges();

            Consumer updatedConsumer = context.Consumers.Where(c => c.Id == consumerID).FirstOrDefault();

            Assert.True(updatedConsumer.Sex == "F");
            Assert.True(updatedConsumer.Email == "testEmail");
            Assert.True(updatedConsumer.Fullname == "Testing update");
            Assert.True(updatedConsumer.Contact == 5);
            Assert.True(updatedConsumer.Nif == "5");
            context.ChangeTracker.Clear();

        }

        [Test]
        public void UpdateConsumerChangingTypeTest()
        {
            Test test = context.Tests.SingleOrDefault(t => t.Internalid == "443244");
            string testID = test.Internalid;
            test.Requestdate = DateOnly.Parse("1999-04-19");
            test.Testtype = "HT";
            context.ChangeTracker.Clear();

            //TODO: DAR ERRO QUANDO SE TENTA MUDAR O TIPO
        }
    }
}
