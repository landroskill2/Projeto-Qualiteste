﻿using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ISessionRepository : IRepository<Session>
    {
        Session? GetSessionById(string id);
        IEnumerable<Session> GetSessionsByDate();
    }
}
