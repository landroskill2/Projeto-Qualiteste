using Microsoft.AspNetCore.Mvc.Filters;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;


namespace Tests.ServiceTests
{
    [TestFixture]
    internal class ConsumerServiceTests
    {
        private ConsumerService consumerService;
        private PostgresContext context = TestsSetup.context;
        private UnitOfWork unitOfWork;


        private static int insertedID = 123123123;
        private Consumer insertedConsumer = new ConsumerInputModel()
        {
            Id = insertedID,
            Fullname = "It's a TEST",
            Nif = "321321321321321",
            Sex = "F",
            DateOfBirth = DateOnly.Parse("1969-03-29"),
            Contact = 974585214,
            Email = "thisisaemail@email.com"
        }.ToDbConsumer();


        [OneTimeSetUp]
        public void SetUp()
        {
            unitOfWork = new UnitOfWork(context);
            consumerService = new ConsumerService(unitOfWork);
            unitOfWork.Consumers.Add(insertedConsumer);
            unitOfWork.Complete();
        }

        [Test]
        public void GetConsumersAlphabeticallyTest()
        {
            var nameFirst = "ACÁCIO COELHO FONSECA";
            var nameLast = "TELMA BRITES VIEIRA";

            IEnumerable<ConsumerOutputModel> consumers;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersAlphabetically();
            consumers = res.Match(error => throw new Exception("Not supposed to fail"),
                                  success => success);


            Assert.That(consumers.First().Fullname, Is.EqualTo(nameFirst));
            Assert.That(consumers.Last().Fullname, Is.EqualTo(nameLast));
        }

        [Test]
        public void GetConsumersFullFilteredTest()
        {
            var nameFilter = "Maria";
            var ageFilter = "60";
            var sexFilter = "F";
            IEnumerable<ConsumerOutputModel> consumers;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered(sexFilter, ageFilter, nameFilter);
            consumers = res.Match(error => throw new Exception("Not supposed to fail"),
                                  success => success);


            foreach (ConsumerOutputModel c in consumers)
            {
                Assert.True(c.Fullname.Contains(nameFilter.ToUpper()));
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
                Assert.That(int.Parse(ageFilter), Is.AtMost(int.Parse(c.Age)));
            }
        }

        [Test]
        public void GetConsumersNameFilteredTest()
        {
            var nameFilter = "Maria";


            IEnumerable<ConsumerOutputModel> consumers;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered(null, null, nameFilter);
            consumers = res.Match(error => throw new Exception("Not supposed to fail"),
                                  success => success);


            foreach (ConsumerOutputModel c in consumers)
            {
                Assert.True(c.Fullname.Contains(nameFilter.ToUpper()));
            }
        }

        [Test]
        public void GetConsumersWithAgeFilterTest()
        {
            var ageFilter = "60";

            IEnumerable<ConsumerOutputModel> consumers;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered(null, ageFilter, null);
            consumers = res.Match(error => throw new Exception("Not supposed to fail"),
                                  success => success);


            foreach (ConsumerOutputModel c in consumers)
            {
                Assert.That(int.Parse(ageFilter), Is.AtMost(int.Parse(c.Age)));
            }
        }

        [Test]
        public void GetConsumersWithSexFilterTest()
        {
            var sexFilter = "f";

            IEnumerable<ConsumerOutputModel> consumers;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered(sexFilter, null, null);
            consumers = res.Match(error => throw new Exception("Not supposed to fail"),
                                  success => success);


            foreach (ConsumerOutputModel c in consumers)
            {
                Assert.That(sexFilter.ToUpper(), Is.EqualTo(c.Sex));
            }
        }

        [Test]
        public void CreateConsumerTest()
        {
            ConsumerInputModel consumer = new()
            {
                Fullname = "It's a TEST",
                Nif = "123123123123123",
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 456456456,
                Email = "thisisaemail@email.com"
            };
            var res = consumerService.CreateNewConsumer(consumer);
            int id = res.Match(
                error => throw new Exception("Not supposed to fail"),
                success => success
                );

            var inserted = unitOfWork.Consumers.GetConsumerById(id);

            Assert.That(consumer.Nif, Is.EqualTo(inserted.Nif));
            Assert.That(id, Is.EqualTo(inserted.Id));


        }

        [Test]
        public void UpdateConsumerTest()
        {
            ConsumerInputModel consumer = new ConsumerInputModel
            {
                Fullname = "testUpdate",
                Nif = "2",
                Sex = "M",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 974585213,
                Email = "thisisanewemail@email.com"
            };

            Either<CustomError, ConsumerOutputModel> result = consumerService.UpdateConsumer(insertedID, consumer);

            ConsumerOutputModel updatedConsumer = result.Match(
                error => throw new Exception(),
                success => success
            );

            //age and nif missing
            Assert.That("testUpdate", Is.EqualTo(updatedConsumer.Fullname));
            Assert.That("M", Is.EqualTo(updatedConsumer.Sex));
            Assert.That(974585213, Is.EqualTo(updatedConsumer.Contact));
            Assert.That("thisisanewemail@email.com", Is.EqualTo(updatedConsumer.Email));
        }

        //Test Errors returned from ConsumerServices

            [Test]  
        public void GetConsumersWithInvalidSexFilter()
        {
            var sexFilter = "T";

            IEnumerable<ConsumerOutputModel> consumers;
            CustomError e;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered(sexFilter, "0", "*");
            e = res.Match(
                error => error,
                success => throw new Exception()
            );


            Assert.That(e, Is.TypeOf(typeof(ConsumerFilterNotValid)));
        }
        [Test]
        public void GetConsumersWithInvalidAgeFilter()
        {
            var ageFilter1 = "-1";
            var ageFilter2 = "Not a valid age";

            IEnumerable<ConsumerOutputModel> consumers;
            CustomError e;
            Either<CustomError, IEnumerable<ConsumerOutputModel>> res = consumerService.GetConsumersFiltered("*", ageFilter1, "*");
            e = res.Match(
                error => error,
                success => throw new Exception("Test is suposed to fail, not succeed")
                );

            Assert.That(e, Is.TypeOf(typeof(ConsumerFilterNotValid)));

            res = consumerService.GetConsumersFiltered("*", ageFilter2, "*");
            e = res.Match(error => error,
                          success => throw new Exception()
                          );

            Assert.That(e, Is.TypeOf(typeof(ConsumerFilterNotValid)));

        }

        [Test]
        public void CreateConsumerWithConflictingContact()
        {
           

            var conflictingConsumer = new ConsumerInputModel
            {
                Fullname = "conflictContact",
                Nif = "123412341234123",
                Sex = "M",
                DateOfBirth = DateOnly.Parse("1819-03-29"),
                Contact = 974585214,
                Email = "thisisaemail2@email.com"
            };

            var res = consumerService.CreateNewConsumer(conflictingConsumer);
            CustomError e = res.Match(
                    error => error,
                    success => throw new Exception("This is supposed to fail")
                );

            Assert.That(e, Is.TypeOf(typeof(ConsumerWithContactAlreadyPresent)));
        }

        [Test]
        public void CreateConsumerWithConflictingId()
        {
            var conflictingConsumer = new ConsumerInputModel
            {
                Id = insertedID,
                Fullname = "conflictID",
                Nif = "123412341234123",
                Sex = "M",
                DateOfBirth = DateOnly.Parse("1819-03-29"),
                Contact = 12345678,
                Email = "thisisaemail2@email.com"
            };

            var res = consumerService.CreateNewConsumer(conflictingConsumer);
            CustomError e = res.Match(
                    error => error,
                    success => throw new Exception("This is supposed to fail")
                );

            Assert.That(e, Is.TypeOf(typeof(ConsumerWithIdAlreadyPresent)));
        }
        [Test]
        public void CreateConsumerWithConflictingNif()
        {
            var conflictingConsumer = new ConsumerInputModel
            {
                Fullname = "conflictNIF",
                Nif = insertedConsumer.Nif,
                Sex = "M",
                DateOfBirth = DateOnly.Parse("1819-03-29"),
                Contact = 12345678,
                Email = "thisisaemail2@email.com"
            };

            var res = consumerService.CreateNewConsumer(conflictingConsumer);
            CustomError e = res.Match(
                    error => error,
                    success => throw new Exception("This is supposed to fail")
                );

            Assert.That(e, Is.TypeOf(typeof(ConsumerWithNifAlreadyPresent)));
        }

        [Test]
        public void UpdateConsumerNifToConflictingValue()
        {
            string conflictingID = "111111111111111";
            ConsumerInputModel consumerIn = new ConsumerInputModel()
            {
                Id = insertedID,
                Fullname = "It's a TEST",
                Nif = conflictingID,
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = 974585214,
                Email = "thisisaemail@email.com"
            };

            Either<CustomError, ConsumerOutputModel> result = consumerService.UpdateConsumer(insertedID, consumerIn);

            CustomError e = result.Match(
                error => error,
                success => throw new Exception("This is supposed to fail")
            );
            Assert.That(e, Is.TypeOf(typeof(ConsumerWithNifAlreadyPresent)));
        }

        [Test]
        public void UpdateConsumerContactToConflictingValue()
        {
            int conflictingContact = 31153;
            ConsumerInputModel consumerIn = new ConsumerInputModel()
            {
                Id = insertedID,
                Fullname = "It's a TEST",
                Nif = insertedConsumer.Nif,
                Sex = "F",
                DateOfBirth = DateOnly.Parse("1969-03-29"),
                Contact = conflictingContact,
                Email = "thisisaemail@email.com"
            };

            Either<CustomError, ConsumerOutputModel> result = consumerService.UpdateConsumer(insertedID, consumerIn);

            CustomError e = result.Match(
                error => error,
                success => throw new Exception("This is supposed to fail")
            );
            Assert.That(e, Is.TypeOf(typeof(ConsumerWithContactAlreadyPresent)));
        }
    }
}
