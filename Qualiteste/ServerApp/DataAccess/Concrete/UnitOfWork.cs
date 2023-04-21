﻿using Qualiteste.ServerApp.DataAccess.Repository;
using Qualiteste.ServerApp.DataAccess.Repository.Concrete;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Concrete
{
    public class UnitOfWork : IUnitOfWork
    {

        private readonly PostgresContext _context;
        public UnitOfWork(PostgresContext context)
        {
            _context = context;
            Consumers = new ConsumerRepository(_context);
            Tests = new TestRepository(_context);
            Sessions = new SessionRepository(_context);
        }

        public IConsumerRepository Consumers { get; private set; }

        public ITestRepository Tests { get; private set; }

        public ISessionRepository Sessions { get; private set; }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
            
        }

        public void UntrackChanges()
        {
            _context.ChangeTracker.Clear();
        }
    }
}
