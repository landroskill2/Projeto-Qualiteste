using Microsoft.EntityFrameworkCore;
using Microsoft.Exchange.WebServices.Data;
using Microsoft.Extensions.Configuration;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.UnitOfWorkTest
{
    [TestFixture]
    internal class UnitOfWorkConcurrencyTests
    {

        private PostgresContext context = TestsSetup.context;
        private UnitOfWork ctx1;

        [OneTimeSetUp]
        public void SetUp()
        {
            ctx1 = new UnitOfWork(context);
            //Create new context for user2
           
        }


        [Test]
        public void UpdateConsumerConcurrently()
        {
            var consumer = new ConsumerInputModel()
            {
                Id = 999999999,
                Fullname = "Testing Consumer",
                Nif = "321321321321321",
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 974585214,
                Email = "thisisaemail@email.com"
            }.ToDbConsumer();
            //Insert consumer with ctx2
            var ctx2 = createUserContext();
            ctx2.Consumers.Add(consumer);
            ctx2.Complete();
            //ctx1 updates consumer without completing
            Console.WriteLine(consumer.Contact);
            consumer.Contact = consumer.Contact + 1;
            ctx1.Consumers.Update(consumer);
            //Update with ctx2 the same resource with different values, and save changes
            consumer.Contact = consumer.Contact + 1;
            ctx2.Consumers.Update(consumer);
            ctx2.Complete();
            var currConsumer = ctx2.Consumers.GetConsumerById(consumer.Id);
            Console.WriteLine(currConsumer.Contact);
            Assert.Throws<DbUpdateConcurrencyException>(() => ctx1.Complete());

        }

        [Test]
        public void AddTestToSession()
        {
            var test = new TestInputModel
            {
                ID = "test",
                TestType = "SP",
                ConsumersNumber = 10,
                RequestDate = DateOnly.Parse("2023-03-29")
            }.toDbTest();

            ctx1.Tests.Add(test);
            ctx1.Complete();

            var ctx2 = createUserContext();

            test.Sessionid = "040423";
            ctx1.Tests.Update(test);

            var test2 = test;

            test2.Sessionid = "250523";
            ctx2.Tests.Update(test2);

            ctx2.Complete();

            Assert.Throws<DbUpdateConcurrencyException>(() => ctx1.Complete());
        }

        private UnitOfWork createUserContext()
        {
            var app = new ConfigurationBuilder()
                       .SetBasePath(Directory.GetCurrentDirectory())
                       .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                       .Build();
            var context2 = new PostgresContext(app, true);
           return new UnitOfWork(context2);
        }


       
    }
}
