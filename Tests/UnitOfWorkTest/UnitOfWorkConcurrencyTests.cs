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
        private UnitOfWork user1;

        [OneTimeSetUp]
        public void SetUp()
        {
            user1 = new UnitOfWork(context);
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

            user1.Consumers.Add(consumer);
            user1.Complete();
            //Update consumer on user1 without completing
            //Create user2 now to have "updated" data 
            var user2 = createUserContext();

            Console.WriteLine(consumer.Fullname);
            consumer.Fullname = "Testing Consumer2";
            user1.Consumers.Update(consumer);
            //Update with user2 the same resource with different values, and save changes
            consumer.Fullname = "Testing Consumer3";
            user2.Consumers.Update(consumer);
            user2.Complete();
            var currConsumer = user2.Consumers.GetConsumerById(consumer.Id);
            Console.WriteLine(currConsumer.Fullname);
            user1.Complete();
            var gotConsumer = user2.Consumers.GetConsumerById(consumer.Id);
            Console.WriteLine(gotConsumer.Fullname);
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
