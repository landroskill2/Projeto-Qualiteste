using Microsoft.AspNetCore.Http;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class SessionService : ISessionService
    {

        private readonly IUnitOfWork _unitOfWork;

        public SessionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Either<CustomError, IEnumerable<SessionOutputModel>> GetSessionsList()
        {
         
            return _unitOfWork.Sessions.GetSessionsByDate().Select(s => s.toOutputModel()).ToList();
           
        }

        public Either<CustomError, SessionPageModel> GetSessionById(string id)
        {
            SessionPageModel pageModel = new SessionPageModel();
            Session? session = _unitOfWork.Sessions.GetSessionById(id);
            if(session == null)
            {
                return new NoSessionFoundWithId();
            }
            pageModel.Session = session.toOutputModel();
            pageModel.Consumers = session.ConsumerSessions.Select(cs => cs.toOutputModel()).ToList();
            pageModel.Tests = session.Tests.Select(t => t.toOutputModel()).ToList();
            return pageModel;
        }

        public Either<CustomError, string> CreateNewSession(SessionInputModel sessionInput)
        {
            try
            {
                Session dbSession = sessionInput.toDbSession();
                _unitOfWork.Sessions.Add(dbSession);
                _unitOfWork.Complete();
                return dbSession.Sessionid;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("22001"))
                        return new SessionIdIsToLong();   
                    else if (state.Equals("23505") && constraint.Equals("session_pkey"))
                        return new SessionWithConflictingID();
                }
                throw ex;
            }
        }

        public Either<CustomError, SessionOutputModel> UpdateSession(int id, SessionInputModel sessionInput)
        {
            try
            {
                Session dbSession = sessionInput.toDbSession();
                _unitOfWork.Sessions.Update(dbSession);
                return dbSession.toOutputModel();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
