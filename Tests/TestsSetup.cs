using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Qualiteste.ServerApp.Models;
using System.Xml.Linq;

namespace Tests
{
    [SetUpFixture]
    public class TestsSetup
    {
        private static PostgresContext _context;

        public static PostgresContext context
        {
            get
            {
                return _context;
            }
        }
        [OneTimeSetUp]
        public void Setup()
        {
            var app = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .Build();
            _context = new PostgresContext(app, true);
            createDB();
            populateDB();

        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        public void createDB()
        {
            _context.Database.EnsureCreated();
        }

        public void populateDB()
        {
            var sql = System.IO.File.ReadAllText("../../../../Qualiteste/ServerApp/SQLScripts/testConsumerData.sql");
            _context.Database.ExecuteSqlRaw(sql);
        }
    }
}