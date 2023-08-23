using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
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
            Session? session = _unitOfWork.Sessions.GetSessionById(id);
            if(session == null)
            {
                return new SessionErrors.NoSessionFoundWithId();
            }
            IEnumerable<ConsumerSessionOutputModel> consumerSessions = session.ConsumerSessions.OrderBy(cs => cs.Consumer.Fullname).Select(cs => cs.toOutputModel());
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
                        return new SessionErrors.SessionIdIsToLong();   
                    else if (state.Equals("23505") && constraint.Equals("session_pkey"))
                        return new SessionErrors.SessionWithConflictingID();
                }
                throw ex;
            }
        }

        public Either<CustomError, SessionOutputModel> UpdateSession(string id, SessionInputModel sessionInput)
        {
            try
            {
                Session target = _unitOfWork.Sessions.GetSessionById(id);
                if (target == null) return new SessionErrors.NoSessionFoundWithId();
                Session dbSession = sessionInput.toDbSession();
                _unitOfWork.Sessions.Update(dbSession);
                return dbSession.toOutputModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Either<CustomError, SessionSuccesses> AddTestToSession(string id, string test)
        {
            try
            {
                Test testToAdd = _unitOfWork.Tests.GetTestById(test);
                
                if(testToAdd.Session != null) return new SessionErrors.TestAlreadyBelongsToASession();

                _unitOfWork.Sessions.AddTestToSession(id, testToAdd);
                _unitOfWork.Complete();
                return new SessionSuccesses.AddTestToSessionSuccess();
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }

        public Either<CustomError, SessionSuccesses> AddConsumerToSession(string id, ConsumerSessionInputModel consumerSession)
        {
            try
            {
                IEnumerable<ConsumerSession> cs = consumerSession.Consumers.Select(c => new ConsumerSession { Consumerid = c , Sessionid = id });
                _unitOfWork.Sessions.AddConsumerToSession(id, cs);
                _unitOfWork.Complete();
                return new SessionSuccesses.AddConsumerToSessionSuccess();
            }catch(InvalidOperationException ex){
                _unitOfWork.UntrackChanges();
                return new SessionErrors.ConsumerAlreadyInSession();
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                if (ex is FormatException)
                {
                    return new SessionErrors.InvalidSessionTimeValue();
                }
                
                throw ex;
            }
        }

        public Either<CustomError, SessionSuccesses> ConfirmConsumerSession(string sessionId, int consumerId, SessionTimeInputModel cSession)
        {
            try
            {
                Session targetSession = _unitOfWork.Sessions.GetSessionById(sessionId);
                if(targetSession == null) return new SessionErrors.NoSessionFoundWithId();
                ConsumerSession toUpdate = _unitOfWork.Sessions.GetConsumerSession(sessionId, consumerId);
                if (toUpdate == null) return new SessionErrors.ConsumerIsNotPresentInSession();
                if (!TimeOnly.TryParse(cSession.sessionTime, out TimeOnly sessionTime)) return new SessionErrors.InvalidSessionTimeValue();
                toUpdate.Sessiontime = sessionTime;
                _unitOfWork.Complete();
                return new SessionSuccesses.ConfirmConsumerSuccess();
                
            }
            catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }

        public Either<CustomError, SessionSuccesses> UpdateAttendanceOfConsumerSession(string sessionId, int cId, SessionAttendanceInputModel cSession)
        {
            try
            {
                Session targetSession = _unitOfWork.Sessions.GetSessionById(sessionId);
                if (targetSession == null) return new SessionErrors.NoSessionFoundWithId();
                ConsumerSession toUpdate = _unitOfWork.Sessions.GetConsumerSession(sessionId, cId);
                if (toUpdate == null) return new SessionErrors.ConsumerIsNotPresentInSession();
                toUpdate.Attendance = cSession.Attendance;
                _unitOfWork.Complete();
                return new SessionSuccesses.UpdateAttendanceSuccess();
            }
            catch(Exception ex) {
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
            if(s == null) return new SessionErrors.NoSessionFoundWithId();
            List<ConsumerSessionOutputModel> res = s.ConsumerSessions.Where(cs => cs.Sessiontime != null).Select(el => el.toOutputModel()).ToList();
            return res;

        }



        public Either<CustomReply, string> GetNotConfirmedConsumersInSession(string sessionId)
        {
            throw new NotImplementedException();
        }

        public Either<CustomError, SessionSuccesses> RemoveConsumerFromSession(string id, string selection)
        {
            try
            {
                int consumerId;
                if (selection.ToLower().Equals("invited"))
                {
                    _unitOfWork.Sessions.RemoveAllInvitedConsumersFromSession(id);
                }
                else if(selection.ToLower().Equals("confirmed")){
                    _unitOfWork.Sessions.RemoveAllConfirmedConsumersFromSession(id);
                }
                else if (int.TryParse(selection, out consumerId))
                {
                    _unitOfWork.Sessions.RemoveConsumerFromSession(id, consumerId);
                }
                else
                {
                    return new SessionErrors.InvalidQueryParameterValue();
                }
                _unitOfWork.Complete();
                return new SessionSuccesses.RemoveInvitedConsumerFromSessionSuccess();
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                if (ex is ArgumentNullException)
                {
                    return new ConsumerErrors.NoConsumerFoundWithId();
                }
                else if(ex is NullReferenceException)
                {
                    return new SessionErrors.NoSessionFoundWithId();
                }
                throw ex;
            }
        }
    }
}
