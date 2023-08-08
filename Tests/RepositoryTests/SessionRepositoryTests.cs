using Microsoft.EntityFrameworkCore;
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
    internal class SessionRepositoryTests
    {
        private SessionRepository _sessionRepository;
        private TestRepository _testRepository;
        private PostgresContext context = TestsSetup.context;

        [OneTimeSetUp]
        public void SetUp()
        {
            _sessionRepository = new SessionRepository(context);
            _testRepository = new TestRepository(context);
        }

        [Test]
        public void GetSessionWithId()
        {
            string sessionID = "040423";

            Session expectedSession = new Session
            {
                Sessionid = sessionID,
                Consumersnumber = 10,
                Sessiondate = DateOnly.FromDateTime(DateTime.Parse("2023-04-04")),
            };

            Session s = _sessionRepository.GetSessionById(sessionID);
            Assert.That(s.Sessionid, Is.EqualTo(expectedSession.Sessionid));
            Assert.That(s.Consumersnumber, Is.EqualTo(expectedSession.Consumersnumber));
            Assert.That(s.Sessiondate, Is.EqualTo(expectedSession.Sessiondate));
        }
        [Test]
        public void GetNonExistingSession()
        {
            string sessionID = "Not_a_ID";


            Session s = _sessionRepository.GetSessionById(sessionID);
            Assert.That(s, Is.EqualTo(null)); 
        }


        [Test]
        public void GetTestsInSession()
        {
            string sessionID = "040423";
            string[] expectedTests = { "443244", "343123" };
            IEnumerable<Test> tests = _sessionRepository.GetTestsInSession(sessionID);

            foreach (Test test in tests)
            {
                Assert.True(expectedTests.Any(t => t.Equals(test.Internalid)));
            }
        }

        [Test]
        public void GetSessionsByDate()
        {
            string[] expectedOrder = { "250523", "040423" };
            Session[] sessions = _sessionRepository.GetSessionsByDate().ToArray();
            int length = sessions.Length;
            for(int i = 0; i < length; i++)
            {
                Assert.That(sessions[0].Sessionid, Is.EqualTo(expectedOrder[0]));
            }   
        }

        [Test]
        public void AddTestToSession()
        {
            //Session to where the test is inserted
            string sessionID = "250523";
            //Add test to BD
            Test test = new TestInputModel
            {
                ID = "9999",
                TestType = "SP",
                ConsumersNumber = 15,
                RequestDate = DateOnly.Parse("2023-03-24")
            }.toDbTest();

            _testRepository.Add(test);
            context.SaveChanges();

            //Insert test in session
            _sessionRepository.AddTestToSession(sessionID, test);
            context.SaveChanges();

            IEnumerable<Test> tests = context.Tests.Where(t => t.Sessionid == sessionID);
            Assert.True(tests.Any(t => t.Internalid == test.Internalid));
        }

        [Test]
        public void AddConsumerToSession()
        {
            //create new session
            Session session = new Session
            {
                Sessionid = "99999999",
                Sessiondate = DateOnly.FromDateTime(DateTime.Now),
                Consumersnumber = 15,
            };
            context.Sessions.Add(session);
            context.SaveChanges();

            List<ConsumerSession> consumerSessions = new List<ConsumerSession>();
            ConsumerSessionInputModel consumerSession = new ConsumerSessionInputModel { sessionTime = "12:00", consumerId = 3 };
            consumerSessions.Add(consumerSession.toDbConsumerSession());

            _sessionRepository.AddConsumerToSession(session.Sessionid, consumerSessions);
            context.SaveChanges();
            //Check if consumer is in session
            ConsumerSession csession = context.Sessions.Single(s => s.Sessionid == session.Sessionid).ConsumerSessions.Single(cs => cs.Consumerid == consumerSession.consumerId);
            Assert.NotNull(csession);
            Assert.That(csession.Consumerid, Is.EqualTo(consumerSession.consumerId));
            //Clean up
            context.ConsumerSessions.Remove(csession);
            context.Sessions.Remove(session);
            context.SaveChanges();
        }

        [Test]
        public void GetConsumersInSession()
        {
            string sessionId = "040423";
            int[] expectedConsumerIds = { 6, 263, 48, 86, 87, 23, 168, 143, 373, 67 };
            IEnumerable<Consumer> consumerInSession = _sessionRepository.GetConsumersInSession(sessionId);
            foreach(int id in expectedConsumerIds)
            {
                Assert.True(consumerInSession.Any(c => c.Id == id));
            }

        }
    }
}
