using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Qualiteste.ServerApp.Models;

namespace Tests
{
    public class TestsSetup
    {
        protected PostgresContext context;
        [SetUp]
        public void Setup()
        {
            var app = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .Build();
            context = new PostgresContext(app, true);
            createDB();
            populateDB();

        }

        [TearDown]
        public void TearDown()
        {
            context.Database.EnsureDeleted();
            context.Dispose();
        }

        public void createDB()
        {
            context.Database.EnsureCreated();
        }

        public void populateDB()
        {

            var sql = System.IO.File.ReadAllText("../../../../Qualiteste/ServerApp/SQLScripts/testConsumerData.sql");
            context.Database.ExecuteSqlRaw(sql);
        }
    }
}