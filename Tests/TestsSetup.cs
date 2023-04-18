using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.Models;

namespace Tests
{
    public class TestsSetup
    {
        protected PostgresContext context;
        [SetUp]
        public void Setup()
        {
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
            var sql = 0; //usar System.IO.File.ReadAllText(ficheiro com inserts)
            //context.Database.ExecuteSqlRaw(sql);
        }
    }
}