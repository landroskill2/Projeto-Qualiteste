using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
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
            var nifLast = "1231517656344";
            var consumers = consumerRepository.GetConsumersAlphabetically();
            Assert.That(consumers.First().Nif, Is.EqualTo(nifFirst));
            Assert.That(consumers.Last().Nif, Is.EqualTo(nifLast));
        }
        [Test]
        public void GetConsumersWithSexFilteredTest()
        {
            var sexFilter = "F";
            var consumers = consumerRepository.GetConsumersFiltered(sexFilter, null, null, null);
            foreach(Consumer c in consumers){
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
            }
           
        }

        [Test]
        public void GetConsumersWithAgeFilteredTest()
        {
            var maxAge = 70;
            var minAge = 50;
            var consumers = consumerRepository.GetConsumersFiltered(null, minAge, maxAge, null);
            foreach (Consumer c in consumers)
            {
                var age = DateTime.Now.Year - c.Dateofbirth.Value.Year;
                Assert.That(age, Is.AtMost(maxAge));
                Assert.That(age, Is.AtLeast(minAge));
            }

        }
        [Test]
        public void GetConsumersWithNameFilteredTest()
        {
            var nameFilter = "Maria";
            var consumers = consumerRepository.GetConsumersFiltered(null, null, null, nameFilter);
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
            var minAge = 50;
            var maxAge = 70;
            var consumers = consumerRepository.GetConsumersFiltered(sexFilter, minAge, maxAge, nameFilter);
            foreach (Consumer c in consumers)
            {
                var age = DateTime.Now.Year - c.Dateofbirth.Value.Year;
                Assert.That(age, Is.AtMost(maxAge));
                Assert.That(age, Is.AtLeast(minAge));
                Assert.That(sexFilter, Is.EqualTo(c.Sex));
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
