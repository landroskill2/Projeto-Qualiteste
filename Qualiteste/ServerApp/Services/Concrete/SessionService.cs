using Microsoft.AspNetCore.Http;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;
using System.Collections.Generic;

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
            Session? session = _unitOfWork.Sessions.GetSessionById(id);
            if(session == null)
            {
                return new NoSessionFoundWithId();
            }
            IEnumerable<ConsumerSessionOutputModel> consumerSessions = session.ConsumerSessions.Select(cs => cs.toOutputModel());
            IEnumerable<TestOutputModel> tests = session.Tests.Select(t => t.toOutputModel());

            return new SessionPageModel
            {
                Session = session.toOutputModel(),
                Consumers = consumerSessions,
                Tests = tests
            };
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

        public Either<CustomError, SessionOutputModel> UpdateSession(string id, SessionInputModel sessionInput)
        {
            try
            {
                Session target = _unitOfWork.Sessions.GetSessionById(id);
                if (target == null) return new NoSessionFoundWithId();
                Session dbSession = sessionInput.toDbSession();
                _unitOfWork.Sessions.Update(dbSession);
                return dbSession.toOutputModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Either<CustomError, string> AddTestToSession(string id, string test)
        {
            try
            {
                Test testToAdd = _unitOfWork.Tests.GetTestById(test);
                
                if(testToAdd.Session != null) return new TestAlreadyBelongsToASession();

                _unitOfWork.Sessions.AddTestToSession(id, testToAdd);
                _unitOfWork.Complete();
                return "Teste adicionado com sucesso";
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }

        public Either<CustomError, string> AddConsumerToSession(string id, IEnumerable<ConsumerSessionInputModel> consumerSession)
        {
            try
            {
                IEnumerable<ConsumerSession> cs = consumerSession.Select(c => c.toDbConsumerSession());
                _unitOfWork.Sessions.AddConsumerToSession(id, cs);
                _unitOfWork.Complete();
                return "Operação executada com sucesso";
            }catch(InvalidOperationException ex){
                _unitOfWork.UntrackChanges();
                return new ConsumerAlreadyInSession();
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                if (ex is FormatException)
                {
                    return new InvalidSessionTimeValue();
                }
                
                throw ex;
            }
        }

        public Either<CustomError, string> RemoveInvitedConsumerFromSession(string sessionId, string selection)
        {

            try
            {
                int consumerId;
                if (selection.ToLower().Equals("all"))
                {
                    _unitOfWork.Sessions.RemoveAllInvitedConsumersFromSession(sessionId);
                }
                else if (int.TryParse(selection, out consumerId))
                {
                    _unitOfWork.Sessions.RemoveInvitedConsumerFromSession(sessionId, consumerId);
                }
                else
                {
                    return new InvalidQueryParameterValue();
                }
                _unitOfWork.Complete();
                return "Operação executada com sucesso.";
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                if (ex is ArgumentNullException)
                {
                    return new NoConsumerFoundWithId();
                }
                else if(ex is NullReferenceException)
                {
                    return new NoSessionFoundWithId();
                }
                throw ex;
            }
        }

        public Either<CustomError, string> ConfirmConsumerSession(string sessionId, ConsumerSessionInputModel cSession)
        {
            try
            {
                Session targetSession = _unitOfWork.Sessions.GetSessionById(sessionId);
                if(targetSession == null) return new NoSessionFoundWithId();
                ConsumerSession toUpdate = _unitOfWork.Sessions.GetConsumerSession(sessionId, cSession.consumerId);
                if (toUpdate == null) return new ConsumerIsNotPresentInSession();
                toUpdate.Sessiontime = cSession.toDbConsumerSession().Sessiontime;
                _unitOfWork.Complete();
                return "Consumer session confirmed";
                
            }
            catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }


        /**
        - Works with ToList but not if i immediately return the IEnumerable
        - Maybe repository functions are obsolete for this kind of operations
        - Service Controller needs a endpoint for this operation
         */
        public Either<CustomError, IEnumerable<ConsumerSessionOutputModel>> GetConfirmedConsumersInSession(string sessionId)
        {
 
            Session? s = _unitOfWork.Sessions.GetSessionById(sessionId);
            if(s == null) return new NoSessionFoundWithId();
            List<ConsumerSessionOutputModel> res = s.ConsumerSessions.Where(cs => cs.Sessiontime != null).Select(el => el.toOutputModel()).ToList();
            return res;

        }

        public Either<CustomError, string> GetNotConfirmedConsumersInSession(string sessionId)
        {
            throw new NotImplementedException();
        }
    }
}
